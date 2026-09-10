export const WILL_VOICE = {
  provider: 'xAI TTS',
  endpoint: '/api/voice/speak',
  upstream: 'https://api.x.ai/v1/tts',
  voiceId: 'atlas',
  language: 'es',
  locale: 'es-ES',
  speed: 0.92,
  compared: ['sal', 'atlas', 'orion'] as const,
  selectedBecause:
    'Masculina adulta, profunda y contenida. No teatral. Español natural. Contraste escuchado frente a Sal y Orion.',
  elevenLabs: 'no_key' as const,
};

export type VoiceUiState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

export const VOICE_STATE_LABEL: Record<VoiceUiState, string> = {
  idle: 'En silencio',
  listening: 'Te escucho',
  processing: 'Preparando',
  speaking: 'Will está hablando',
  error: 'La voz no está disponible ahora',
};

export function prepareWillSpeech(text: string) {
  const clean = text
    .replace(/\*\*/g, '')
    .replace(/[_`#]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 4000);
  return clean.replace(/\n\n/g, ' [pause] ');
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
