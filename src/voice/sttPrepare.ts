export function cleanSttMime(mime: string): string {
  const base = String(mime || 'audio/webm').split(';')[0].trim().toLowerCase();
  if (base.includes('wav')) return 'audio/wav';
  if (base.includes('mpeg') || base.includes('mp3')) return 'audio/mpeg';
  if (base.includes('mp4') || base.includes('m4a') || base.includes('aac')) return 'audio/mp4';
  if (base.includes('ogg')) return 'audio/ogg';
  if (base.includes('webm')) return 'audio/webm';
  return 'audio/webm';
}

export function mixToMono(channels: Float32Array[]): Float32Array {
  const len = channels[0]?.length || 0;
  const out = new Float32Array(len);
  const n = Math.max(1, channels.length);
  for (let c = 0; c < channels.length; c++) {
    const data = channels[c];
    for (let i = 0; i < len; i++) out[i] += data[i] / n;
  }
  return out;
}

export function resampleLinear(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (!input.length || fromRate === toRate) return input;
  if (fromRate <= 0 || toRate <= 0) return input;
  const ratio = fromRate / toRate;
  const n = Math.max(1, Math.round(input.length / ratio));
  const out = new Float32Array(n);
  const last = input.length - 1;
  for (let i = 0; i < n; i++) {
    const x = i * ratio;
    const i0 = Math.min(last, Math.floor(x));
    const i1 = Math.min(last, i0 + 1);
    const f = x - i0;
    out[i] = input[i0] * (1 - f) + input[i1] * f;
  }
  return out;
}

export function pcm16WavBytes(samples: Float32Array, sampleRate: number): Uint8Array {
  const n = samples.length;
  const dataBytes = n * 2;
  const buf = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buf);
  const write = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  write(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, dataBytes, true);
  let o = 44;
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    o += 2;
  }
  return new Uint8Array(buf);
}

export async function prepareSttBlob(blob: Blob): Promise<Blob> {
  if (typeof window === 'undefined') return blob;
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const AC = w.AudioContext || w.webkitAudioContext;
  if (!AC) return blob;
  let ctx: AudioContext | null = null;
  try {
    ctx = new AC();
    const raw = await blob.arrayBuffer();
    const audio = await ctx.decodeAudioData(raw.slice(0));
    const channels: Float32Array[] = [];
    for (let c = 0; c < audio.numberOfChannels; c++) {
      channels.push(audio.getChannelData(c));
    }
    const mono = mixToMono(channels);
    const target = 16000;
    const samples = resampleLinear(mono, audio.sampleRate, target);
    if (samples.length < 1600) return blob;
    return new Blob([pcm16WavBytes(samples, target)], { type: 'audio/wav' });
  } catch {
    return blob;
  } finally {
    try {
      await ctx?.close();
    } catch {
      /* ignore */
    }
  }
}
