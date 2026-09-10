export type MicDiagCause =
  | 'ghost_click'
  | 'speech_recognition'
  | 'unexpected_stop_stt'
  | 'silence_timeout'
  | 'audio_context'
  | 'react_teardown'
  | 'chrome_only'
  | 'user_ended'
  | 'unknown';

export type MicDiagEventType =
  | 'session'
  | 'start'
  | 'lock'
  | 'data'
  | 'unexpected_stop'
  | 'unexpected_error'
  | 'restart'
  | 'ghost_blocked'
  | 'user_stop'
  | 'stt_start'
  | 'stt_ok'
  | 'stt_fail'
  | 'track_ended'
  | 'idle'
  | 'error';

export type MicDiagEvent = {
  t: number;
  type: MicDiagEventType;
  msSinceStart?: number;
  bytes?: number;
  recorderState?: string;
  wantStop?: boolean;
  detail?: string;
};

export type MicDiagFlags = {
  speechRecognition?: boolean;
  silenceTimeout?: boolean;
  audioContextRequired?: boolean;
  chromeOnly?: boolean;
  reactOwnsStream?: boolean;
};

export type MicDiagVerdict = {
  cause: MicDiagCause;
  confidence: 'alta' | 'media' | 'baja';
  evidence: string[];
  nextPatch: string;
};

const CAUSE_PATCH: Record<MicDiagCause, string> = {
  ghost_click:
    'Lock ~900ms tras start. El tap de permiso no puede ser stop. HUD lejos del mic.',
  speech_recognition:
    'Quitar SpeechRecognition del path de captura. STT de servidor solo al terminar el usuario.',
  unexpected_stop_stt:
    'start(1000). Restart en el mismo stream. STT solo si wantStop es true.',
  silence_timeout: 'Borrar el timeout / VAD que cierra por silencio.',
  audio_context:
    'Captura = MediaRecorder sobre el stream. Web Audio no es obligatorio.',
  react_teardown:
    'Singleton fuera de React. El estado solo pinta. El unmount no para el stream.',
  chrome_only:
    'Feature-detect. MIME del motor o sin MIME. Prohibido filtrar por Chrome.',
  user_ended: 'No es un corte. El usuario cerró la captura.',
  unknown:
    'Recoger snapshot __willMicDiag y pasar a la siguiente causa. No repetir el último parche.',
};

let sessionAt = 0;
let startedAt = 0;
const events: MicDiagEvent[] = [];
let flags: MicDiagFlags = {};

function now() {
  return Date.now();
}

export function resetMicDiag(nextFlags: MicDiagFlags = {}) {
  events.length = 0;
  flags = { ...nextFlags };
  sessionAt = now();
  startedAt = 0;
  recordMicDiag({ type: 'session' });
}

export function setMicDiagFlags(next: MicDiagFlags) {
  flags = { ...flags, ...next };
}

export function recordMicDiag(
  event: Omit<MicDiagEvent, 't' | 'msSinceStart'> & { t?: number },
) {
  const t = event.t ?? now();
  if (event.type === 'start') startedAt = t;
  events.push({
    ...event,
    t,
    msSinceStart: startedAt ? t - startedAt : 0,
  });
  if (events.length > 300) events.splice(0, events.length - 300);
}

export function micDiagEvents() {
  return events.slice();
}

export function isolateMicCause(
  log: MicDiagEvent[] = events,
  live: MicDiagFlags = flags,
): MicDiagVerdict {
  const evidence: string[] = [];
  const types = log.map((e) => e.type);
  const start = log.find((e) => e.type === 'start');
  const userStop = log.find((e) => e.type === 'user_stop');
  const stt = log.find((e) => e.type === 'stt_start' || e.type === 'stt_ok');
  const unexpected = log.filter((e) => e.type === 'unexpected_stop' || e.type === 'unexpected_error');
  const ghost = log.filter((e) => e.type === 'ghost_blocked');
  const trackEnded = log.find((e) => e.type === 'track_ended');
  const idle = log.find((e) => e.type === 'idle');

  if (live.speechRecognition) {
    evidence.push('SpeechRecognition está en el path de captura.');
    return verdict('speech_recognition', 'alta', evidence);
  }
  if (live.chromeOnly) {
    evidence.push('Hay filtro o MIME solo Chrome.');
    return verdict('chrome_only', 'alta', evidence);
  }
  if (live.silenceTimeout) {
    evidence.push('Hay timeout o VAD de silencio.');
    return verdict('silence_timeout', 'alta', evidence);
  }
  if (live.audioContextRequired) {
    evidence.push('La captura depende de AudioContext/ScriptProcessor.');
    return verdict('audio_context', 'alta', evidence);
  }
  if (live.reactOwnsStream) {
    evidence.push('React posee el stream; un unmount puede cortar.');
    return verdict('react_teardown', 'alta', evidence);
  }

  if (userStop && (!start || (userStop.t - (start.t || 0) >= 900))) {
    evidence.push('Hay user_stop explícito.');
    return verdict('user_ended', 'alta', evidence);
  }

  const earlyStop = userStop && start && userStop.t - start.t < 900;
  if (earlyStop || ghost.length > 0) {
    if (earlyStop) {
      evidence.push(
        `Stop ${userStop!.t - start!.t}ms después de start (ghost click).`,
      );
    }
    if (ghost.length) evidence.push(`Ghost click bloqueado ${ghost.length} vez(es).`);
    return verdict('ghost_click', earlyStop ? 'alta' : 'media', evidence);
  }

  if (unexpected.length && stt && !userStop) {
    evidence.push(
      `onstop/onerror inesperado (${unexpected.length}) y STT sin user_stop.`,
    );
    return verdict('unexpected_stop_stt', 'alta', evidence);
  }

  if (unexpected.length && !userStop) {
    evidence.push(`onstop/onerror inesperado (${unexpected.length}) sin fin de usuario.`);
    return verdict('unexpected_stop_stt', 'media', evidence);
  }

  if (stt && !userStop) {
    evidence.push('STT corrió sin user_stop: se transcribió un corte.');
    return verdict('unexpected_stop_stt', 'alta', evidence);
  }

  if (trackEnded && !userStop) {
    evidence.push('La pista de audio terminó sola.');
    return verdict('react_teardown', 'media', evidence);
  }

  if (idle && start && !userStop) {
    evidence.push('La captura pasó a idle sin fin de usuario.');
    return verdict('unknown', 'media', evidence);
  }

  if (types.includes('error') && !userStop) {
    evidence.push(log.find((e) => e.type === 'error')?.detail || 'error de captura');
    return verdict('unknown', 'baja', evidence);
  }

  evidence.push('El registro no aísla una causa con evidencia suficiente.');
  return verdict('unknown', 'baja', evidence);
}

function verdict(
  cause: MicDiagCause,
  confidence: MicDiagVerdict['confidence'],
  evidence: string[],
): MicDiagVerdict {
  return { cause, confidence, evidence, nextPatch: CAUSE_PATCH[cause] };
}

export function micDiagSnapshot() {
  const verdictNow = isolateMicCause();
  return {
    listeningMs: startedAt ? now() - startedAt : 0,
    events: micDiagEvents(),
    flags: { ...flags },
    verdict: verdictNow,
  };
}

export function scanCaptureSource(source: string): MicDiagFlags {
  return {
    speechRecognition: /SpeechRecognition|webkitSpeechRecognition/.test(source),
    silenceTimeout: /silenceMs|endOfSpeech|vad\b|silenceTimeout/i.test(source),
    audioContextRequired:
      /createScriptProcessor|AudioContext/.test(source) && /getUserMedia/.test(source)
        && !/MediaRecorder/.test(source),
    chromeOnly:
      /isChrome\s*=/.test(source) || /userAgent[^;\n]{0,80}includes\([^)]*chrome/i.test(source),
    reactOwnsStream: /useRef<\s*MediaRecorder|useState\([^)]*MediaRecorder/.test(source),
  };
}

export function installMicDiagProbe() {
  if (typeof window === 'undefined') return;
  const w = window as Window & { __willMicDiag?: unknown };
  w.__willMicDiag = {
    snapshot: micDiagSnapshot,
    events: micDiagEvents,
    isolate: isolateMicCause,
    reset: resetMicDiag,
    record: recordMicDiag,
  };
}
