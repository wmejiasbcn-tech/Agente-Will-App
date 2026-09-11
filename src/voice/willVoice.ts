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

export const WILL_VOICE_LAB = {
  provider: 'Kokoro',
  voiceId: 'em_alex',
  modelId: 'Kokoro-82M',
  role: 'experimental',
};

const LAB_KEY = 'will-voice-lab';

export function readVoiceLab(): 'eleven' | 'kokoro' {
  if (typeof window === 'undefined') return 'eleven';
  try {
    const q = new URLSearchParams(window.location.search).get('willVoice');
    if (q === 'kokoro' || q === 'em_alex') {
      sessionStorage.setItem(LAB_KEY, 'kokoro');
      return 'kokoro';
    }
    if (q === 'eleven' || q === 'will') {
      sessionStorage.removeItem(LAB_KEY);
      return 'eleven';
    }
    if (sessionStorage.getItem(LAB_KEY) === 'kokoro') return 'kokoro';
  } catch {
    /* private mode */
  }
  return 'eleven';
}

export type VoiceUiState =
  | 'idle'
  | 'preparing_listen'
  | 'listening'
  | 'transcribing'
  | 'ready_review'
  | 'processing'
  | 'preparing_reply'
  | 'speaking'
  | 'paused'
  | 'muted'
  | 'error';

export const VOICE_STATE_LABEL: Record<VoiceUiState, string> = {
  idle: 'En silencio',
  preparing_listen: 'Preparando escucha',
  listening: 'Te estoy escuchando.',
  transcribing: 'Procesando lo que has dicho',
  ready_review: 'Listo para revisar. Envíalo cuando quieras.',
  processing: 'Te he escuchado. Estoy con ello.',
  preparing_reply: 'Preparando respuesta',
  speaking: 'Will hablando',
  paused: 'Pausado',
  muted: 'Silenciado',
  error: 'No he podido usar el micrófono. Puedes escribir.',
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
    el.setAttribute('webkit-playsinline', 'true');
    (el as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
    el.setAttribute('preload', 'auto');
    el.style.display = 'none';
    document.body.appendChild(el);
  }
  return el;
}

const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

export function unlockWillAudio() {
  const el = getSharedWillAudio();
  if (!el) return;
  try {
    el.setAttribute('playsinline', 'true');
    el.setAttribute('webkit-playsinline', 'true');
    (el as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
    el.loop = true;
    const speaking = Boolean(el.src) && el.src.startsWith('blob:') && !el.paused;
    if (speaking) return;
    el.src = SILENT_WAV;
    el.muted = true;
    el.volume = 0;
    const go = el.play();
    if (go && typeof go.then === 'function') {
      void go
        .then(() => {
          el.muted = false;
          el.volume = 0;
        })
        .catch(() => {
          try {
            el.muted = false;
          } catch {
            /* ignore */
          }
        });
    }
  } catch {
    try {
      el.muted = false;
    } catch {
      /* ignore */
    }
  }
}

