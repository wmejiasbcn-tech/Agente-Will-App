export const WILL_VOICE = {
  provider: 'ElevenLabs',
  endpoint: '/api/voice/speak',
  listenEndpoint: '/api/voice/listen',
  upstream: 'https://api.elevenlabs.io/v1/text-to-speech',
  voiceId: 'DrwFQsjvHFpLcKyvtbE3',
  modelId: 'eleven_multilingual_v2',
  language: 'es',
  locale: 'es-ES',
  outputFormat: 'mp3_44100_128',
};

export type VoiceUiState =
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'processing'
  | 'speaking'
  | 'error';

export const VOICE_STATE_LABEL: Record<VoiceUiState, string> = {
  idle: 'En silencio',
  listening: 'Te estoy escuchando.',
  transcribing: 'Estoy pasando a escrito lo que has dicho…',
  processing: 'Te he escuchado. Estoy con ello.',
  speaking: 'Will está hablando',
  error: 'No he podido escribir lo que has dicho. Pulsa el micrófono y prueba otra vez.',
};

const MUTE_KEY = 'will-voice-muted';

export function prepareWillSpeech(text: string) {
  return text
    .replace(/\*\*/g, '')
    .replace(/[_`#]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 4000);
}

export function splitWillSpeech(text: string): string[] {
  const clean = prepareWillSpeech(text);
  if (!clean) return [];
  const pieces: string[] = [];
  let rest = clean;
  while (rest.length) {
    const match = rest.match(/[.!?…]+(?:\s+|$)/);
    if (!match || match.index === undefined) {
      pieces.push(rest.trim());
      break;
    }
    const end = match.index + match[0].length;
    const piece = rest.slice(0, end).trim();
    if (piece) pieces.push(piece);
    rest = rest.slice(end);
  }
  const merged: string[] = [];
  for (const piece of pieces) {
    const last = merged[merged.length - 1];
    if (last && piece.length < 24 && `${last} ${piece}`.length < 180) {
      merged[merged.length - 1] = `${last} ${piece}`;
    } else {
      merged.push(piece);
    }
  }
  return merged.length ? merged : [clean];
}

export function readVoiceMuted(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  try {
    return sessionStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeVoiceMuted(muted: boolean) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    /* private mode */
  }
}

export function getSharedWillAudio(): HTMLAudioElement | null {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById('will-voice-el') as HTMLAudioElement | null;
  if (!el) {
    el = document.createElement('audio');
    el.id = 'will-voice-el';
    el.setAttribute('playsinline', 'true');
    el.setAttribute('preload', 'auto');
    el.style.display = 'none';
    document.body.appendChild(el);
  }
  return el;
}

export function unlockWillAudio() {
  const el = getSharedWillAudio();
  if (!el) return;
  try {
    el.muted = true;
    const p = el.play();
    if (p && typeof p.then === 'function') {
      void p
        .then(() => {
          el.pause();
          el.muted = false;
          el.currentTime = 0;
        })
        .catch(() => {
          el.muted = false;
        });
    }
  } catch {
    el.muted = false;
  }
}

export function speechRecognitionCtor():
  | (new () => SpeechRecognition)
  | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}
