export const KOKORO_PROVIDER = 'Kokoro';
export const KOKORO_VOICE = 'em_alex';
export const KOKORO_MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
export const KOKORO_SAMPLE_RATE = 24000;

type RawLike = {
  audio?: Float32Array | number[];
  data?: Float32Array | number[];
  sampling_rate?: number;
  samplingRate?: number;
};

type KokoroEngine = {
  tokenizer: (
    phonemes: string,
    opts: { truncation: boolean },
  ) => { input_ids: unknown };
  generate_from_ids: (
    ids: unknown,
    opts: { voice: string; speed: number },
  ) => Promise<RawLike>;
};

type EphoneEngine = {
  setVoice: (id: string) => void;
  textToIpaWithSourceMap: (text: string) => { ipa?: string };
};

let engine: KokoroEngine | null = null;
let engineLoading: Promise<KokoroEngine> | null = null;
let g2p: EphoneEngine | null = null;
let g2pLoading: Promise<EphoneEngine> | null = null;

export function kokoroIdentity() {
  return {
    provider: KOKORO_PROVIDER,
    voiceId: KOKORO_VOICE,
    modelId: 'Kokoro-82M',
    language: 'es',
    locale: 'es-ES',
    storesAudio: false,
  };
}

function floatToPcm16Wav(samples: Float32Array, sampleRate: number) {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7fff, offset);
    offset += 2;
  }
  return buffer;
}

function rawToWav(raw: RawLike) {
  const src = raw.audio || raw.data;
  if (!src) throw new Error('Kokoro no ha devuelto audio.');
  const samples = src instanceof Float32Array ? src : Float32Array.from(src);
  const rate = raw.sampling_rate || raw.samplingRate || KOKORO_SAMPLE_RATE;
  return floatToPcm16Wav(samples, rate);
}

export async function getSpanishG2P() {
  if (g2p) return g2p;
  if (!g2pLoading) {
    g2pLoading = (async () => {
      const mod = await import('ephone');
      const createEphone = mod.default;
      const loaded = (await createEphone(mod.roa)) as EphoneEngine;
      loaded.setVoice('es');
      return loaded;
    })();
  }
  g2p = await g2pLoading;
  return g2p;
}

export async function spanishPhonemes(text: string) {
  const phonemizer = await getSpanishG2P();
  const result = phonemizer.textToIpaWithSourceMap(text);
  return String(result?.ipa || '').replace(/\s+/g, ' ').trim();
}

export async function getKokoroEngine() {
  if (engine) return engine;
  if (!engineLoading) {
    engineLoading = (async () => {
      const { mkdirSync } = await import('node:fs');
      const { env } = await import('@huggingface/transformers');
      const cacheDir = '/tmp/will-kokoro-cache';
      mkdirSync(cacheDir, { recursive: true });
      env.cacheDir = cacheDir;
      const { KokoroTTS } = await import('kokoro-js');
      return (await KokoroTTS.from_pretrained(KOKORO_MODEL_ID, {
        dtype: 'q8',
        device: 'cpu',
      })) as unknown as KokoroEngine;
    })();
  }
  try {
    engine = await engineLoading;
    return engine;
  } catch (error) {
    engineLoading = null;
    engine = null;
    throw error;
  }
}

export async function generateKokoroSpeech(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) {
    throw new Error('No hay texto para leer.');
  }
  const [tts, phonemes] = await Promise.all([getKokoroEngine(), spanishPhonemes(clean)]);
  if (!phonemes) {
    throw new Error('Kokoro no ha podido fonetizar el texto.');
  }
  const encoded = tts.tokenizer(phonemes, { truncation: true });
  if (!encoded?.input_ids) {
    throw new Error('Kokoro no ha podido tokenizar los fonemas.');
  }
  const raw = await tts.generate_from_ids(encoded.input_ids, {
    voice: KOKORO_VOICE,
    speed: 1,
  });
  const wav = rawToWav(raw);
  if (wav.length < 200) {
    throw new Error('Kokoro ha devuelto audio vacío.');
  }
  return {
    wav,
    mime: 'audio/wav' as const,
    voiceId: KOKORO_VOICE,
    provider: KOKORO_PROVIDER,
    phonemes,
  };
}
