export type MicCaptureStatus = 'idle' | 'listening' | 'error';

export type MicCaptureSnap = {
  status: MicCaptureStatus;
  seconds: number;
};

type Listener = (snap: MicCaptureSnap) => void;

const listeners = new Set<Listener>();

let stream: MediaStream | null = null;
let ctx: AudioContext | null = null;
let source: MediaStreamAudioSourceNode | null = null;
let processor: ScriptProcessorNode | null = null;
let mute: GainNode | null = null;
let chunks: Float32Array[] = [];
let sampleRate = 44100;
let listening = false;
let startedAt = 0;
let tick: number | null = null;

function snap(): MicCaptureSnap {
  return {
    status: listening ? 'listening' : 'idle',
    seconds: listening ? Math.floor((Date.now() - startedAt) / 1000) : 0,
  };
}

function emit() {
  const s = snap();
  listeners.forEach((fn) => fn(s));
}

function clearGraph() {
  try {
    processor?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    source?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    mute?.disconnect();
  } catch {
    /* ignore */
  }
  processor = null;
  source = null;
  mute = null;
}

async function closeCtx() {
  if (ctx && ctx.state !== 'closed') {
    try {
      await ctx.close();
    } catch {
      /* ignore */
    }
  }
  ctx = null;
}

function stopTracks() {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
}

function mergeChunks() {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Float32Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

function encodeWav(data: Float32Array, rate: number) {
  const bytes = data.length * 2;
  const buf = new ArrayBuffer(44 + bytes);
  const v = new DataView(buf);
  const ascii = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i));
  };
  ascii(0, 'RIFF');
  v.setUint32(4, 36 + bytes, true);
  ascii(8, 'WAVE');
  ascii(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  ascii(36, 'data');
  v.setUint32(40, bytes, true);
  let p = 44;
  for (let i = 0; i < data.length; i++, p += 2) {
    const s = Math.max(-1, Math.min(1, data[i]));
    v.setInt16(p, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: 'audio/wav' });
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
  chunks = [];
  const media = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream = media;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  if (ctx.state === 'suspended') await ctx.resume();
  sampleRate = ctx.sampleRate;
  source = ctx.createMediaStreamSource(media);
  processor = ctx.createScriptProcessor(4096, 1, 1);
  processor.onaudioprocess = (ev) => {
    if (!listening) return;
    if (Date.now() - startedAt > 120000) return;
    chunks.push(new Float32Array(ev.inputBuffer.getChannelData(0)));
  };
  mute = ctx.createGain();
  mute.gain.value = 0;
  source.connect(processor);
  processor.connect(mute);
  mute.connect(ctx.destination);
  listening = true;
  startedAt = Date.now();
  if (tick) window.clearInterval(tick);
  tick = window.setInterval(emit, 250);
  emit();
}

export async function stopWillMic(): Promise<Blob | null> {
  if (!listening && chunks.length === 0) return null;
  listening = false;
  if (tick) {
    window.clearInterval(tick);
    tick = null;
  }
  clearGraph();
  await closeCtx();
  stopTracks();
  const data = mergeChunks();
  chunks = [];
  emit();
  if (data.length < sampleRate * 0.25) return null;
  return encodeWav(data, sampleRate);
}

export async function cancelWillMic() {
  listening = false;
  if (tick) {
    window.clearInterval(tick);
    tick = null;
  }
  chunks = [];
  clearGraph();
  await closeCtx();
  stopTracks();
  emit();
}
