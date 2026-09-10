export type EngineHint = 'chromium' | 'gecko' | 'webkit' | 'unknown';

export type CompatEnv = {
  userAgent?: string;
  protocol?: string;
  getUserMedia?: boolean;
  mediaRecorder?: boolean;
  isTypeSupported?: (type: string) => boolean;
  geolocation?: boolean;
  audioElement?: boolean;
  webAudio?: boolean;
  speechRecognition?: boolean;
};

export type CompatReport = {
  engine: EngineHint;
  https: boolean;
  mic: {
    getUserMedia: boolean;
    mediaRecorder: boolean;
    mime: string;
    canCapture: boolean;
  };
  geo: boolean;
  audio: {
    element: boolean;
    webAudio: boolean;
  };
  speechRecognition: boolean;
};

const RECORDER_MIMES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

export function inferEngine(ua: string): EngineHint {
  const n = ua.toLowerCase();
  if (n.includes('firefox') || n.includes('gecko/')) {
    if (!n.includes('like gecko')) return 'gecko';
  }
  if (n.includes('safari') && !n.includes('chrome') && !n.includes('chromium') && !n.includes('edg')) {
    return 'webkit';
  }
  if (n.includes('chrome') || n.includes('chromium') || n.includes('edg') || n.includes('comet') || n.includes('neo')) {
    return 'chromium';
  }
  return 'unknown';
}

export function pickRecorderMime(isTypeSupported?: (type: string) => boolean): string {
  if (typeof isTypeSupported !== 'function') return '';
  return RECORDER_MIMES.find((type) => {
    try {
      return isTypeSupported(type);
    } catch {
      return false;
    }
  }) || '';
}

export function readLiveCompatEnv(): CompatEnv {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { userAgent: '', protocol: 'https:' };
  }
  const w = window as Window & {
    AudioContext?: unknown;
    webkitAudioContext?: unknown;
    SpeechRecognition?: unknown;
    webkitSpeechRecognition?: unknown;
    MediaRecorder?: { isTypeSupported?: (t: string) => boolean };
  };
  return {
    userAgent: navigator.userAgent || '',
    protocol: window.location?.protocol,
    getUserMedia: Boolean(navigator.mediaDevices?.getUserMedia),
    mediaRecorder: typeof w.MediaRecorder === 'function',
    isTypeSupported:
      typeof w.MediaRecorder?.isTypeSupported === 'function'
        ? (type) => w.MediaRecorder!.isTypeSupported!(type)
        : undefined,
    geolocation: Boolean(navigator.geolocation?.getCurrentPosition),
    audioElement: typeof Audio === 'function',
    webAudio: Boolean(w.AudioContext || w.webkitAudioContext),
    speechRecognition: Boolean(w.SpeechRecognition || w.webkitSpeechRecognition),
  };
}

export function buildCompatReport(env: CompatEnv): CompatReport {
  const mime = pickRecorderMime(env.isTypeSupported);
  const getUserMedia = Boolean(env.getUserMedia);
  const mediaRecorder = Boolean(env.mediaRecorder);
  return {
    engine: inferEngine(env.userAgent || ''),
    https: env.protocol === 'https:' || env.protocol === 'http:',
    mic: {
      getUserMedia,
      mediaRecorder,
      mime,
      canCapture: getUserMedia && mediaRecorder,
    },
    geo: Boolean(env.geolocation),
    audio: {
      element: env.audioElement !== false,
      webAudio: Boolean(env.webAudio),
    },
    speechRecognition: Boolean(env.speechRecognition),
  };
}

export function probeWillCompat(env: CompatEnv = readLiveCompatEnv()): CompatReport {
  return buildCompatReport(env);
}

export function micWorksWithoutSpeechRecognition(report: CompatReport): boolean {
  return report.mic.canCapture;
}

export function sourceUsesChromeOnlyGate(source: string): boolean {
  return /if\s*\([^)]*(chrome|isChrome)/i.test(source)
    || /userAgent[^;\n]{0,80}includes\([^)]*chrome/i.test(source)
    || /isChrome\s*=/.test(source)
    || /chrome-only|solo en chrome/i.test(source);
}
