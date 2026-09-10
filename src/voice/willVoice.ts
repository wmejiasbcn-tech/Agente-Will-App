export const WILL_VOICE = {
  provider: 'ElevenLabs',
  endpoint: '/api/voice/speak',
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
  | 'processing'
  | 'speaking'
  | 'error';

export const VOICE_STATE_LABEL: Record<VoiceUiState, string> = {
  idle: 'En silencio',
  listening: 'Te escucho.',
  processing: 'Will está preparando la voz…',
  speaking: 'Will está hablando',
  error: 'La voz no está disponible ahora',
};

export function prepareWillSpeech(text: string) {
  return text
    .replace(/\*\*/g, '')
    .replace(/[_`#]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 4000);
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
