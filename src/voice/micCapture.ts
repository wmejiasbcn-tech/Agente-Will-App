import { pickRecorderMime } from '../utils/browserCompat';
import {
  installMicDiagProbe,
  recordMicDiag,
  resetMicDiag,
} from './micDiagnostics';

export type MicCaptureStatus = 'idle' | 'listening';

export type MicCaptureSnap = {
  status: MicCaptureStatus;
  seconds: number;
};

export type MicFailReason =
  | 'denied'
  | 'insecure'
  | 'busy'
  | 'notfound'
  | 'unsupported'
  | 'empty'
  | 'stt'
  | 'mic';

type Listener = (snap: MicCaptureSnap) => void;

const listeners = new Set<Listener>();

let stream: MediaStream | null = null;
let recorder: MediaRecorder | null = null;
let blobs: Blob[] = [];
let listening = false;
let wantStop = false;
let startedAt = 0;
let tick: number | null = null;

function snap(): MicCaptureSnap {
  return {
    status: listening ? 'listening' : 'idle',
    seconds: listening ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0,
  };
}

function emit() {
  const s = snap();
  listeners.forEach((fn) => fn(s));
}

function pickMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  return pickRecorderMime((type) => MediaRecorder.isTypeSupported(type));
}

function pin() {
  (window as unknown as { __willMic?: unknown }).__willMic = { stream, recorder };
}

function stopTracks() {
  stream?.getTracks().forEach((t) => {
    try {
      t.stop();
    } catch {
      /* ignore */
    }
  });
  stream = null;
}

function startRecorder(rec: MediaRecorder) {
  try {
    rec.start(1000);
  } catch {
    rec.start();
  }
}

function makeRecorder(media: MediaStream): MediaRecorder {
  const mime = pickMime();
  const attempts: Array<() => MediaRecorder> = [
    ...(mime ? [() => new MediaRecorder(media, { mimeType: mime })] : []),
    () => new MediaRecorder(media),
  ];
  let last: unknown;
  for (const make of attempts) {
    try {
      return make();
    } catch (err) {
      last = err;
    }
  }
  throw last || Object.assign(new Error('mic'), { name: 'NotSupportedError' });
}

function attachRecorder(media: MediaStream) {
  const rec = makeRecorder(media);
  recorder = rec;
  rec.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) {
      blobs.push(ev.data);
      recordMicDiag({
        type: 'data',
        bytes: ev.data.size,
        recorderState: rec.state,
        wantStop,
      });
    }
  };
  rec.onerror = () => {
    recordMicDiag({
      type: 'unexpected_error',
      recorderState: rec.state,
      wantStop,
      detail: 'MediaRecorder.onerror',
    });
    if (wantStop || !listening || !stream) return;
    window.setTimeout(() => {
      if (wantStop || !listening || !stream) return;
      try {
        attachRecorder(stream);
        if (recorder) startRecorder(recorder);
        recordMicDiag({ type: 'restart', detail: 'after onerror' });
      } catch {
        /* keep stream alive */
      }
    }, 80);
  };
  rec.onstop = () => {
    if (wantStop || !listening || !stream) return;
    recordMicDiag({
      type: 'unexpected_stop',
      recorderState: rec.state,
      wantStop,
      detail: 'MediaRecorder.onstop',
    });
    try {
      attachRecorder(stream);
      if (recorder) startRecorder(recorder);
      recordMicDiag({ type: 'restart', detail: 'after onstop' });
    } catch {
      /* keep stream alive */
    }
  };
  pin();
  return rec;
}

type GumFn = (constraints: MediaStreamConstraints) => Promise<MediaStream>;

function getUserMediaFn(): GumFn | null {
  const md = navigator.mediaDevices;
  if (md && typeof md.getUserMedia === 'function') {
    return (constraints) => md.getUserMedia(constraints);
  }
  const legacy = (
    navigator as Navigator & {
      webkitGetUserMedia?: (
        c: MediaStreamConstraints,
        ok: (s: MediaStream) => void,
        err: (e: unknown) => void,
      ) => void;
      getUserMedia?: (
        c: MediaStreamConstraints,
        ok: (s: MediaStream) => void,
        err: (e: unknown) => void,
      ) => void;
    }
  ).webkitGetUserMedia || (navigator as Navigator & { getUserMedia?: GumFn }).getUserMedia;
  if (typeof legacy === 'function' && legacy.length >= 3) {
    const fn = legacy as (
      c: MediaStreamConstraints,
      ok: (s: MediaStream) => void,
      err: (e: unknown) => void,
    ) => void;
    return (constraints) =>
      new Promise((resolve, reject) => fn.call(navigator, constraints, resolve, reject));
  }
  return null;
}

async function acquireStream(): Promise<MediaStream> {
  const gum = getUserMediaFn();
  if (!gum) {
    throw Object.assign(new Error('mic'), { name: 'NotFoundError' });
  }
  const attempts: MediaStreamConstraints[] = [
    { audio: true },
    { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } },
  ];
  let last: unknown;
  for (const constraints of attempts) {
    try {
      return await gum(constraints);
    } catch (err) {
      last = err;
      const name = (err as { name?: string })?.name || '';
      if (
        name === 'NotAllowedError' ||
        name === 'SecurityError' ||
        name === 'PermissionDeniedError'
      ) {
        throw err;
      }
    }
  }
  throw last || Object.assign(new Error('mic'), { name: 'NotReadableError' });
}

export function classifyMicFailure(err: unknown): MicFailReason {
  if (typeof window !== 'undefined' && window.isSecureContext === false) return 'insecure';
  const name = (err as { name?: string })?.name || '';
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
    return 'denied';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'notfound';
  if (name === 'NotReadableError' || name === 'TrackStartError' || name === 'AbortError') {
    return 'busy';
  }
  if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') return 'busy';
  if (name === 'NotSupportedError' || name === 'TypeError') return 'unsupported';
  return 'mic';
}

export function isWillMicListening() {
  return listening;
}

export function subscribeWillMic(fn: Listener) {
  listeners.add(fn);
  fn(snap());
  return () => {
    listeners.delete(fn);
  };
}

export async function startWillMic() {
  if (listening && stream?.getAudioTracks().some((t) => t.readyState === 'live')) return;
  if (listening) {
    listening = false;
    stopTracks();
    recorder = null;
  }
  installMicDiagProbe();
  resetMicDiag();
  wantStop = false;
  blobs = [];
  if (!getUserMediaFn()) {
    recordMicDiag({ type: 'error', detail: 'no getUserMedia' });
    throw Object.assign(new Error('mic'), { name: 'NotFoundError' });
  }
  let media: MediaStream;
  try {
    media = await acquireStream();
  } catch (err) {
    recordMicDiag({
      type: 'error',
      detail: classifyMicFailure(err),
    });
    throw err;
  }
  stream = media;
  media.getAudioTracks().forEach((track) => {
    track.enabled = true;
    track.addEventListener('ended', () => {
      if (wantStop) return;
      recordMicDiag({ type: 'track_ended', detail: track.readyState });
    });
  });
  try {
    const rec = attachRecorder(media);
    startRecorder(rec);
    if (rec.state === 'inactive') {
      try {
        rec.start();
      } catch {
        /* el onerror/onstop reintenta sobre el mismo stream */
      }
    }
    listening = true;
    startedAt = Date.now();
    recordMicDiag({
      type: 'start',
      recorderState: rec.state,
      detail: rec.mimeType || 'default',
    });
    recordMicDiag({ type: 'lock', detail: '900ms' });
    if (tick) window.clearInterval(tick);
    tick = window.setInterval(emit, 250);
    emit();
  } catch (err) {
    listening = false;
    stopTracks();
    recorder = null;
    recordMicDiag({ type: 'error', detail: classifyMicFailure(err) });
    throw err;
  }
}

export async function stopWillMic(): Promise<Blob | null> {
  wantStop = true;
  listening = false;
  recordMicDiag({ type: 'user_stop', wantStop: true });
  if (tick) {
    window.clearInterval(tick);
    tick = null;
  }
  const rec = recorder;
  if (rec && rec.state !== 'inactive') {
    await new Promise<void>((resolve) => {
      const done = () => resolve();
      rec.addEventListener('stop', done, { once: true });
      try {
        if (typeof rec.requestData === 'function') rec.requestData();
      } catch {
        /* algunos motores no exponen requestData */
      }
      try {
        rec.stop();
      } catch {
        resolve();
      }
      window.setTimeout(done, 1500);
    });
  }
  recorder = null;
  stopTracks();
  (window as unknown as { __willMic?: unknown }).__willMic = undefined;
  const blob = new Blob(blobs, { type: rec?.mimeType || 'audio/webm' });
  blobs = [];
  recordMicDiag({ type: 'idle', bytes: blob.size, wantStop: true });
  emit();
  if (blob.size < 400) return null;
  return blob;
}
