import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Mic, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import {
  VOICE_STATE_LABEL,
  VoiceUiState,
  getSharedWillAudio,
  micErrorCopy,
  readMicBreak,
  readVoiceMuted,
  speakErrorCopy,
  splitWillSpeech,
  unlockWillAudio,
  writeMicBreak,
  writeVoiceMuted,
} from '../voice/willVoice';
import { recordMicDiag } from '../voice/micDiagnostics';
import {
  classifyMicFailure,
  isWillMicListening,
  startWillMic,
  stopWillMic,
  subscribeWillMic,
} from '../voice/micCapture';
import { probeWillCompat } from '../utils/browserCompat';
interface WillSpeakApi {
  speakingId: string | null;
  loadingId: string | null;
  paused: boolean;
  muted: boolean;
  error: string | null;
  reveal: Record<string, string>;
  visibleText: (id: string, full: string) => string;
  play: (id: string, text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  replay: (id: string, text: string) => Promise<void>;
  mute: () => void;
  unmute: () => void;
  unlock: () => void;
  clear: () => void;
}

let playGen = 0;
let lastSpeakBreak = '';
let speakAbort: AbortController | null = null;

function writeSpeakBreak(reason: string, http: number) {
  lastSpeakBreak = ['TTS', reason, http ? `http${http}` : ''].filter(Boolean).join(' · ');
}

const PUBLISHED_SPEAK = 'https://agente-will-app.vercel.app/api/voice/speak';
const PUBLISHED_LISTEN = 'https://agente-will-app.vercel.app/api/voice/listen';

function speakUrls(): string[] {
  if (typeof location === 'undefined') return ['/api/voice/speak'];
  if (location.hostname === 'agente-will-app.vercel.app') return ['/api/voice/speak'];
  return ['/api/voice/speak', PUBLISHED_SPEAK];
}

function listenUrls(): string[] {
  if (typeof location === 'undefined') return ['/api/voice/listen'];
  if (location.hostname === 'agente-will-app.vercel.app') return ['/api/voice/listen'];
  return ['/api/voice/listen', PUBLISHED_LISTEN];
}

function classifiedReason(status: number, reason: string) {
  const allowed = new Set([
    'auth',
    'quota',
    'voice',
    'request',
    'empty',
    'exception',
    'upstream',
    'network',
    'no_tts_key',
  ]);
  if (allowed.has(reason)) return reason;
  if (status === 401 || status === 403) return 'auth';
  if (status === 404) return 'voice';
  if (status === 402 || status === 429) return 'quota';
  if (status === 400 || status === 422) return 'request';
  if (status === 503 && reason === 'no_tts_key') return 'no_tts_key';
  if (status >= 500) return 'upstream';
  return 'upstream';
}

async function fetchWillSpeech(text: string, signal?: AbortSignal): Promise<Blob | null> {
  const payload = { text };
  let lastStatus = 0;
  let lastReason = '';
  const urls = speakUrls();
  for (const url of urls) {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (signal?.aborted) return null;
      try {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
          body: JSON.stringify(payload),
          signal,
        });
        lastStatus = r.status;
        if (r.ok) {
          const blob = await r.blob();
          const type = blob.type || '';
          const audioLike =
            blob.size > 200 &&
            (type.includes('audio') ||
              type.includes('mpeg') ||
              type === 'application/octet-stream' ||
              type === '');
          if (audioLike) {
            lastSpeakBreak = '';
            return blob;
          }
          lastReason = 'empty';
        } else {
          const data = await r.json().catch(() => ({} as { reason?: string }));
          lastReason = classifiedReason(r.status, String(data?.reason || ''));
          if (lastReason === 'auth' || lastReason === 'voice') {
            writeSpeakBreak(lastReason, r.status);
            return null;
          }
          if (lastReason === 'quota') {
            await new Promise((ok) => setTimeout(ok, 1200 * (attempt + 1)));
            continue;
          }
          if (lastReason === 'no_tts_key') break;
        }
      } catch {
        if (signal?.aborted) return null;
        lastReason = 'network';
      }
      if (attempt === 0) {
        await new Promise((ok) => setTimeout(ok, 400));
      }
    }
    if (
      url === PUBLISHED_SPEAK &&
      lastReason &&
      lastReason !== 'no_tts_key' &&
      lastReason !== 'network'
    ) {
      writeSpeakBreak(lastReason, lastStatus);
      return null;
    }
  }
  writeSpeakBreak(lastReason || 'upstream', lastStatus || 502);
  return null;
}

function playOnShared(blob: Blob, gen: number): Promise<'ended' | 'error' | 'stopped'> {
  const audio = getSharedWillAudio();
  if (!audio) return Promise.resolve('error');
  const url = URL.createObjectURL(blob);
  return new Promise((resolve) => {
    let settled = false;
    const tick = window.setInterval(() => {
      if (playGen !== gen) finish('stopped');
    }, 80);
    const stall = window.setTimeout(() => {
      if (!settled && audio.paused && audio.currentTime === 0) finish('error');
    }, 8000);
    const finish = (why: 'ended' | 'error' | 'stopped') => {
      if (settled) return;
      settled = true;
      window.clearInterval(tick);
      window.clearTimeout(stall);
      audio.onended = null;
      audio.onerror = null;
      URL.revokeObjectURL(url);
      resolve(why);
    };
    audio.onended = () => finish('ended');
    audio.onerror = () => finish('error');
    try {
      audio.pause();
    } catch {
      /* ignore */
    }
    audio.loop = false;
    audio.muted = false;
    audio.volume = 1;
    audio.src = url;
    try {
      audio.currentTime = 0;
    } catch {
      /* El elemento acaba de cambiar de src; play() parte del inicio. */
    }
    const go = audio.play();
    if (go && typeof go.then === 'function') {
      void go.catch(() => {
        audio.muted = false;
        audio.volume = 1;
        const again = audio.play();
        if (again && typeof again.then === 'function') {
          void again.catch(() => finish('error'));
        }
      });
    }
  });
}

export function useWillSpeak(): WillSpeakApi {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reveal, setReveal] = useState<Record<string, string>>({});
  const pausedRef = useRef(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    const next = readVoiceMuted();
    setMuted(next);
    mutedRef.current = next;
  }, []);

  const stopAudio = () => {
    playGen += 1;
    speakAbort?.abort();
    speakAbort = null;
    const audio = getSharedWillAudio();
    if (audio) {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
    }
    setSpeakingId(null);
    setLoadingId(null);
    setPaused(false);
    pausedRef.current = false;
  };

  const clear = () => {
    stopAudio();
    setReveal({});
    setError(null);
  };

  useEffect(() => () => stopAudio(), []);

  const play = async (id: string, text: string) => {
    const gen = ++playGen;
    speakAbort?.abort();
    speakAbort = new AbortController();
    const signal = speakAbort.signal;
    setError(null);
    if (mutedRef.current) {
      setReveal((prev) => ({ ...prev, [id]: text }));
      setLoadingId(null);
      setSpeakingId(null);
      return;
    }
    const parts = splitWillSpeech(text);
    setLoadingId(id);
    setSpeakingId(id);
    setPaused(false);
    pausedRef.current = false;
    let shown = '';
    try {
      for (let i = 0; i < parts.length; i++) {
        if (gen !== playGen || signal.aborted) return;
        const blob = await fetchWillSpeech(parts[i], signal);
        if (gen !== playGen || signal.aborted) return;
        if (!blob) {
          setReveal((prev) => ({ ...prev, [id]: text }));
          const reason = lastSpeakBreak.split(' · ')[1] || 'upstream';
          setError(speakErrorCopy(reason));
          continue;
        }
        shown = shown ? `${shown} ${parts[i]}` : parts[i];
        setReveal((prev) => ({ ...prev, [id]: shown }));
        setLoadingId(null);
        setSpeakingId(id);
        const why = await playOnShared(blob, gen);
        if (gen !== playGen) return;
        if (why === 'error') {
          setReveal((prev) => ({ ...prev, [id]: text }));
          setError('La voz de Will no se ha podido reproducir ahora. El texto sigue visible.');
        }
      }
      setReveal((prev) => ({ ...prev, [id]: text }));
    } catch {
      setReveal((prev) => ({ ...prev, [id]: text }));
      setError('La voz de Will no se ha podido reproducir ahora. El texto sigue visible.');
    } finally {
      if (gen === playGen) {
        setLoadingId(null);
        setSpeakingId(null);
        setPaused(false);
        pausedRef.current = false;
      }
    }
  };

  return {
    speakingId,
    loadingId,
    paused,
    muted,
    error,
    reveal,
    visibleText: (id, full) => {
      if (muted) return full;
      if (reveal[id] !== undefined) return reveal[id];
      if (loadingId === id) return '';
      return full;
    },
    play,
    pause: () => {
      getSharedWillAudio()?.pause();
      pausedRef.current = true;
      setPaused(true);
    },
    resume: () => {
      pausedRef.current = false;
      setPaused(false);
      void getSharedWillAudio()?.play();
    },
    stop: stopAudio,
    replay: (id, text) => play(id, text),
    mute: () => {
      writeVoiceMuted(true);
      mutedRef.current = true;
      setMuted(true);
      stopAudio();
    },
    unmute: () => {
      writeVoiceMuted(false);
      mutedRef.current = false;
      setMuted(false);
      unlockWillAudio();
    },
    unlock: unlockWillAudio,
    clear,
  };
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('audio'));
    reader.readAsDataURL(blob);
  });
}

async function transcribeBlob(blob: Blob): Promise<string> {
  const dataUrl = await blobToDataUrl(blob);
  const payload = JSON.stringify({ audio: dataUrl, mime: blob.type || 'audio/webm' });
  for (const url of listenUrls()) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      const data = await r.json().catch(() => ({} as { text?: string }));
      const spoken = String(data?.text || '').trim();
      if (r.ok && spoken) return spoken;
    } catch {
      /* prueba la siguiente ruta */
    }
  }
  throw Object.assign(new Error('stt'), { willReason: 'stt' });
}

interface MicProps {
  onTranscript: (text: string, final: boolean) => void;
  currentText?: string;
  disabled?: boolean;
  state: VoiceUiState;
  setState: (s: VoiceUiState) => void;
}

export const WillMicButton: React.FC<MicProps> = ({
  onTranscript,
  currentText = '',
  disabled,
  state,
  setState,
}) => {
  const startingRef = useRef(false);
  const lockUntil = useRef(0);
  const seedRef = useRef(currentText);
  seedRef.current = currentText;

  const finish = async () => {
    setState('transcribing');
    recordMicDiag({ type: 'stt_start' });
    try {
      const blob = await stopWillMic();
      if (!blob) {
        recordMicDiag({ type: 'stt_fail', bytes: 0, detail: 'empty blob' });
        writeMicBreak('empty');
        setState('error');
        return;
      }
      const spoken = await transcribeBlob(blob);
      recordMicDiag({ type: 'stt_ok', bytes: blob.size, detail: String(spoken.length) });
      const seed = seedRef.current.trim();
      onTranscript(seed ? `${seed} ${spoken}` : spoken, true);
      writeMicBreak('');
      setState('ready_review');
    } catch {
      recordMicDiag({ type: 'stt_fail', detail: 'exception' });
      writeMicBreak('stt');
      setState('error');
    }
  };

  const onClick = async () => {
    if (disabled || startingRef.current || state === 'transcribing') return;
    if (isWillMicListening() || state === 'listening') {
      if (Date.now() < lockUntil.current) {
        recordMicDiag({ type: 'ghost_blocked', detail: 'lock' });
        return;
      }
      await finish();
      return;
    }
    await beginListen();
  };

  const beginListen = async () => {
    if (disabled || startingRef.current || state === 'transcribing') return;
    if (isWillMicListening() || state === 'listening') return;
    startingRef.current = true;
    lockUntil.current = Date.now() + 3500;
    writeMicBreak('');
    probeWillCompat();
    try {
      await startWillMic();
      unlockWillAudio();
      lockUntil.current = Date.now() + 1800;
      setState('listening');
    } catch (err) {
      writeMicBreak(classifyMicFailure(err));
      setState('error');
    } finally {
      startingRef.current = false;
    }
  };

  const active = state === 'listening' || isWillMicListening();

  return (
    <button
      type="button"
      id="will-mic-btn"
      disabled={disabled || state === 'transcribing'}
      onClick={() => void onClick()}
      className={`p-2.5 min-h-11 min-w-11 shrink-0 flex items-center justify-center touch-manipulation ${
        active ? 'text-[#e8c37a] will-mic-live' : 'text-[#ead6b4]/35 hover:text-[#e8c37a]'
      }`}
      aria-pressed={active}
      aria-label={active ? 'He terminado de hablar' : 'Hablar con Will'}
      title={active ? 'He terminado de hablar' : 'Hablar con Will'}
    >
      <Mic className={`w-4 h-4 ${active ? '' : 'opacity-80'}`} />
    </button>
  );
};

export const WillFinishTalkButton: React.FC<{
  onTranscript: (text: string, final: boolean) => void;
  currentText?: string;
  state: VoiceUiState;
  setState: (s: VoiceUiState) => void;
}> = ({ onTranscript, currentText = '', state, setState }) => {
  const [sec, setSec] = useState(0);
  const [busy, setBusy] = useState(false);
  const seedRef = useRef(currentText);
  seedRef.current = currentText;
  const live =
    state === 'preparing_listen' ||
    state === 'listening' ||
    state === 'transcribing' ||
    state === 'error' ||
    isWillMicListening();

  useEffect(() => {
    return subscribeWillMic((snap) => {
      setSec(snap.status === 'listening' ? snap.seconds : 0);
      if (snap.status === 'listening') setState('listening');
    });
  }, [setState]);

  if (!live) return null;

  const clock = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  const onFinish = async () => {
    if (busy || sec < 1) return;
    setBusy(true);
    setState('transcribing');
    recordMicDiag({ type: 'stt_start', detail: 'hud' });
    try {
      const blob = await stopWillMic();
      if (!blob) {
        recordMicDiag({ type: 'stt_fail', bytes: 0, detail: 'empty blob hud' });
        writeMicBreak('empty');
        setState('error');
        return;
      }
      const spoken = await transcribeBlob(blob);
      recordMicDiag({ type: 'stt_ok', bytes: blob.size, detail: String(spoken.length) });
      const seed = seedRef.current.trim();
      onTranscript(seed ? `${seed} ${spoken}` : spoken, true);
      writeMicBreak('');
      setState('ready_review');
    } catch {
      recordMicDiag({ type: 'stt_fail', detail: 'hud exception' });
      writeMicBreak('stt');
      setState('error');
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div className="will-mic-dock">
      <p className="will-copy text-[15px]">
        {state === 'error'
          ? micErrorCopy(readMicBreak())
          : busy || state === 'transcribing'
            ? 'Procesando lo que has dicho'
            : state === 'preparing_listen'
              ? 'Preparando escucha'
              : `Te estoy escuchando · ${clock}`}
      </p>
      {sec >= 1 && !busy && state !== 'transcribing' && state !== 'error' ? (
        <button
          type="button"
          id="will-mic-finish"
          onClick={() => void onFinish()}
          className="mt-2 min-h-11 px-4 py-2 text-[14px] will-copy arch-glass"
        >
          He terminado de hablar
        </button>
      ) : (
        <p className="text-[12px] will-copy-muted mt-1">Pulsa el micrófono otra vez cuando termines. No te corto yo.</p>
      )}
    </div>,
    document.body,
  );
};

export const VoiceStateLine: React.FC<{
  state: VoiceUiState;
  error?: string | null;
}> = ({ state, error }) => {
  if (state === 'listening' || isWillMicListening()) return null;
  if (state === 'idle' && !error) return null;
  const line =
    state === 'error' ? micErrorCopy(readMicBreak()) : error || VOICE_STATE_LABEL[state];
  return (
    <p className="text-[12px] will-copy px-1 pb-2" role="status" aria-live="polite">
      {line}
      {error && lastSpeakBreak ? (
        <span className="block font-mono text-[11px] will-copy-muted mt-1">{lastSpeakBreak}</span>
      ) : null}
    </p>
  );
};

export const WillMuteButton: React.FC<{ speak: WillSpeakApi }> = ({ speak }) => (
  <button
    type="button"
    id="will-mute-btn"
    onClick={() => (speak.muted ? speak.unmute() : speak.mute())}
    className={`p-2.5 min-h-11 min-w-11 shrink-0 flex items-center justify-center ${
      speak.muted ? 'text-[#ead6b4]/35 hover:text-[#e8c37a]' : 'text-[#e8c37a]'
    }`}
    aria-pressed={!speak.muted}
    aria-label={speak.muted ? 'Activar voz' : 'Silenciar'}
    title={speak.muted ? 'Activar voz' : 'Silenciar'}
  >
    {speak.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
  </button>
);

export const MessageVoiceControls: React.FC<{
  id: string;
  text: string;
  speak: WillSpeakApi;
}> = ({ id, text, speak }) => {
  const mine = speak.speakingId === id;
  const loading = speak.loadingId === id;
  return (
    <div className="flex items-center gap-0.5">
      {loading && (
        <span
          className="p-1.5 min-h-11 min-w-11 flex items-center justify-center text-[#e8c37a]"
          aria-label="Te he escuchado. Estoy con ello."
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        </span>
      )}
      {mine && !speak.paused && (
        <button
          type="button"
          onClick={speak.pause}
          className="p-1.5 min-h-11 min-w-11 flex items-center justify-center text-[#e8c37a]"
          aria-label="Pausar"
        >
          <Pause className="w-3.5 h-3.5" />
        </button>
      )}
      {mine && speak.paused && (
        <button
          type="button"
          onClick={speak.resume}
          className="p-1.5 min-h-11 min-w-11 flex items-center justify-center text-[#e8c37a]"
          aria-label="Continuar"
        >
          <Play className="w-3.5 h-3.5" />
        </button>
      )}
      {mine && (
        <button
          type="button"
          onClick={speak.stop}
          className="p-1.5 min-h-11 min-w-11 flex items-center justify-center text-[#e8c37a]"
          aria-label="Detener"
        >
          <Square className="w-3 h-3" />
        </button>
      )}
      {speak.muted && !mine && !loading && (
        <button
          type="button"
          onClick={() => {
            speak.unmute();
            void speak.play(id, text);
          }}
          className="p-1.5 min-h-11 min-w-11 flex items-center justify-center text-[#ead6b4]/35 hover:text-[#e8c37a]"
          aria-label="Activar voz"
          title="Activar voz"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
