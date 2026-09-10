import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Mic, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import {
  VOICE_STATE_LABEL,
  VoiceUiState,
  getSharedWillAudio,
  readVoiceMuted,
  splitWillSpeech,
  unlockWillAudio,
  writeVoiceMuted,
} from '../voice/willVoice';
import { recordMicDiag } from '../voice/micDiagnostics';
import { probeWillCompat } from '../utils/browserCompat';
import {
  isWillMicListening,
  startWillMic,
  stopWillMic,
  subscribeWillMic,
} from '../voice/micCapture';

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

async function fetchWillSpeech(text: string): Promise<Blob | null> {
  const r = await fetch('/api/voice/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) return null;
  const blob = await r.blob();
  if (!blob.size) return null;
  return blob;
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
    const finish = (why: 'ended' | 'error' | 'stopped') => {
      if (settled) return;
      settled = true;
      window.clearInterval(tick);
      audio.onended = null;
      audio.onerror = null;
      URL.revokeObjectURL(url);
      resolve(why);
    };
    audio.onended = () => finish('ended');
    audio.onerror = () => finish('error');
    audio.src = url;
    audio.currentTime = 0;
    const go = audio.play();
    if (go && typeof go.then === 'function') {
      void go.catch(() => finish('error'));
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
      let pending = parts.length ? fetchWillSpeech(parts[0]) : Promise.resolve(null);
      for (let i = 0; i < parts.length; i++) {
        if (gen !== playGen) return;
        const blob = await pending;
        if (gen !== playGen) return;
        pending =
          i + 1 < parts.length ? fetchWillSpeech(parts[i + 1]) : Promise.resolve(null);
        if (!blob) {
          setReveal((prev) => ({ ...prev, [id]: text }));
          setError('La voz de Will no se ha podido reproducir ahora. El texto sigue visible.');
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
        setState('error');
        return;
      }
      const dataUrl = await blobToDataUrl(blob);
      const r = await fetch('/api/voice/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: dataUrl, mime: blob.type || 'audio/webm' }),
      });
      const data = await r.json().catch(() => ({}));
      const spoken = String(data?.text || '').trim();
      if (!r.ok || !spoken) {
        recordMicDiag({ type: 'stt_fail', bytes: blob.size, detail: String(r.status) });
        setState('error');
        return;
      }
      recordMicDiag({ type: 'stt_ok', bytes: blob.size, detail: String(spoken.length) });
      const seed = seedRef.current.trim();
      onTranscript(seed ? `${seed} ${spoken}` : spoken, true);
      setState('ready_review');
    } catch {
      recordMicDiag({ type: 'stt_fail', detail: 'exception' });
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
    if (!probeWillCompat().mic.canCapture) {
      setState('error');
      return;
    }
    startingRef.current = true;
    setState('preparing_listen');
    try {
      unlockWillAudio();
      await startWillMic();
      lockUntil.current = Date.now() + 1200;
      setState('listening');
    } catch {
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
      className={`p-2.5 min-h-11 min-w-11 shrink-0 flex items-center justify-center ${
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
        setState('error');
        return;
      }
      const dataUrl = await blobToDataUrl(blob);
      const r = await fetch('/api/voice/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: dataUrl, mime: blob.type || 'audio/webm' }),
      });
      const data = await r.json().catch(() => ({}));
      const spoken = String(data?.text || '').trim();
      if (!r.ok || !spoken) {
        recordMicDiag({ type: 'stt_fail', bytes: blob.size, detail: 'hud ' + String(r.status) });
        setState('error');
        return;
      }
      recordMicDiag({ type: 'stt_ok', bytes: blob.size, detail: String(spoken.length) });
      const seed = seedRef.current.trim();
      onTranscript(seed ? `${seed} ${spoken}` : spoken, true);
      setState('ready_review');
    } catch {
      recordMicDiag({ type: 'stt_fail', detail: 'hud exception' });
      setState('error');
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div className="will-mic-dock">
      <p className="will-copy text-[15px]">
        {state === 'error'
          ? 'No he podido usar el micrófono. Pulsa el micrófono otra vez.'
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
  return (
    <p className="text-[12px] will-copy px-1 pb-2" role="status" aria-live="polite">
      {error || VOICE_STATE_LABEL[state]}
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
