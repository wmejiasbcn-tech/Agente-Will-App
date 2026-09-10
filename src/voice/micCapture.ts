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
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
}

function startRecorder(rec: MediaRecorder) {
  try {
    rec.start(1000);
  } catch {
    rec.start();
  }
}

function attachRecorder(media: MediaStream) {
  const mime = pickMime();
  const rec = mime ? new MediaRecorder(media, { mimeType: mime }) : new MediaRecorder(media);
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
  if (listening) return;
  installMicDiagProbe();
  resetMicDiag();
  wantStop = false;
  blobs = [];
  if (!navigator.mediaDevices?.getUserMedia) {
    recordMicDiag({ type: 'error', detail: 'no getUserMedia' });
    throw new Error('mic');
  }
  const media = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream = media;
  media.getAudioTracks().forEach((track) => {
    track.addEventListener('ended', () => {
      if (wantStop) return;
      recordMicDiag({ type: 'track_ended', detail: track.readyState });
    });
  });
  const rec = attachRecorder(media);
  startRecorder(rec);
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
