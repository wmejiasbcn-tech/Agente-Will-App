const DEFAULT_VOICE_ID = 'DrwFQsjvHFpLcKyvtbE3';

let activeAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let originalSpeak: typeof window.speechSynthesis.speak | null = null;
let originalCancel: typeof window.speechSynthesis.cancel | null = null;
let installed = false;

export function installWillElevenLabsVoice() {
  if (installed || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  installed = true;

  const synth = window.speechSynthesis;
  originalSpeak = synth.speak.bind(synth);
  originalCancel = synth.cancel.bind(synth);

  synth.speak = (utterance: SpeechSynthesisUtterance) => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }

    activeUtterance = utterance;
    const audio = new Audio();
    activeAudio = audio;
    audio.preload = 'auto';

    audio.onended = () => {
      if (activeUtterance === utterance) {
        activeAudio = null;
        activeUtterance = null;
        utterance.onend?.(new Event('end') as SpeechSynthesisEvent);
      }
    };

    audio.onerror = () => {
      if (activeUtterance === utterance) {
        activeAudio = null;
        activeUtterance = null;
        utterance.onerror?.(new SpeechSynthesisErrorEvent('error', { error: 'audio-busy' }));
      }
    };

    fetch('/api/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: utterance.text, voiceId: DEFAULT_VOICE_ID }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.text()) || 'Voice generation failed');
        return response.blob();
      })
      .then((blob) => {
        if (activeUtterance !== utterance) return;
        audio.src = URL.createObjectURL(blob);
        void audio.play();
      })
      .catch((error) => {
        console.error('Will ElevenLabs voice error:', error);
        audio.onerror?.(new Event('error'));
      });
  };

  synth.cancel = () => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
    const utterance = activeUtterance;
    activeUtterance = null;
    if (utterance) utterance.onend?.(new Event('end') as SpeechSynthesisEvent);
    originalCancel?.();
  };
}

export function uninstallWillElevenLabsVoice() {
  if (!installed || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (originalSpeak) window.speechSynthesis.speak = originalSpeak;
  if (originalCancel) window.speechSynthesis.cancel = originalCancel;
  installed = false;
  activeAudio?.pause();
  activeAudio = null;
  activeUtterance = null;
}
