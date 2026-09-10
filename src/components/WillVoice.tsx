import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Mic, Pause, Play, Square, Volume2 } from 'lucide-react';
import { VOICE_STATE_LABEL, VoiceUiState } from '../voice/willVoice';
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
  error: string | null;
  play: (id: string, text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  replay: (id: string, text: string) => Promise<void>;
  clear: () => void;
}

export function useWillSpeak(): WillSpeakApi {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urls = useRef<Map<string, string>>(new Map());
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopAudio = () => {
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    audioRef.current = null;
    setSpeakingId(null);
    setLoadingId(null);
    setPaused(false);
  };

  const clear = () => {
    stopAudio();
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current.clear();
    setError(null);
  };

  useEffect(() => () => clear(), []);

  const play = async (id: string, text: string) => {
    stopAudio();
    setError(null);
    setLoadingId(id);
    try {
      const r = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) {
        setLoadingId(null);
        setError('La voz de Will no se ha podido reproducir ahora. El texto sigue visible.');
        return;
      }
      const prev = urls.current.get(id);
      if (prev) URL.revokeObjectURL(prev);
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      urls.current.set(id, url);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setSpeakingId(null);
        setPaused(false);
      };
      audio.onerror = () => {
        setError('La voz de Will no se ha podido reproducir ahora. El texto sigue visible.');
        setSpeakingId(null);
        setLoadingId(null);
      };
      setLoadingId(null);
      setSpeakingId(id);
      setPaused(false);
      await audio.play();
    } catch {
      setLoadingId(null);
      setError('La voz de Will no se ha podido reproducir ahora. El texto sigue visible.');
    }
  };

  return {
    speakingId,
    loadingId,
    paused,
    error,
    play,
    pause: () => {
      audioRef.current?.pause();
      setPaused(true);
    },
    resume: () => {
      void audioRef.current?.play();
      setPaused(false);
    },
    stop: stopAudio,
    replay: (id, text) => play(id, text),
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
  currentText = '',
  disabled,
  state,
  setState,
}) => {
  const startingRef = useRef(false);
  const seedRef = useRef(currentText);
  seedRef.current = currentText;

  const onClick = async () => {
    if (disabled || startingRef.current) return;
    if (isWillMicListening() || state === 'listening' || state === 'transcribing') return;
    startingRef.current = true;
    try {
      await startWillMic();
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
      disabled={disabled || active || state === 'transcribing'}
      onClick={() => void onClick()}
      className={`p-2.5 min-h-11 min-w-11 shrink-0 flex items-center justify-center ${
        active ? 'text-[#e8c37a] will-mic-live' : 'text-[#ead6b4]/35 hover:text-[#e8c37a]'
      }`}
      aria-pressed={active}
      aria-label="Hablar con Will"
      title="Hablar con Will"
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
  const live = state === 'listening' || state === 'transcribing' || isWillMicListening();

  useEffect(() => {
    return subscribeWillMic((snap) => {
      setSec(snap.status === 'listening' ? snap.seconds : 0);
      if (snap.status === 'listening') setState('listening');
    });
  }, [setState]);

  if (!live) return null;

  const clock = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  const onFinish = async () => {
    if (busy || sec < 3) return;
    setBusy(true);
    setState('transcribing');
    try {
      const blob = await stopWillMic();
      if (!blob) {
        setState('error');
        return;
      }
      const dataUrl = await blobToDataUrl(blob);
      const r = await fetch('/api/voice/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: dataUrl, mime: 'audio/wav' }),
      });
      const data = await r.json().catch(() => ({}));
      const spoken = String(data?.text || '').trim();
      if (!r.ok || !spoken) {
        setState('error');
        return;
      }
      const seed = seedRef.current.trim();
      onTranscript(seed ? `${seed} ${spoken}` : spoken, true);
      setState('idle');
    } catch {
      setState('error');
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div className="will-mic-dock">
      <p className="will-copy text-[15px]">
        {busy || state === 'transcribing'
          ? 'Estoy pasando a escrito lo que has dicho…'
          : `Will te está escuchando · ${clock}`}
      </p>
      {sec >= 3 && !busy && state !== 'transcribing' ? (
        <button
          type="button"
          id="will-mic-finish"
          onClick={() => void onFinish()}
          className="mt-2 min-h-11 px-4 py-2 text-[14px] will-copy arch-glass"
        >
          He terminado de hablar
        </button>
      ) : null}
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
          aria-label="Will está preparando la voz"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        </span>
      )}
      {!mine && !loading && (
        <button
          type="button"
          onClick={() => speak.play(id, text)}
          className="p-1.5 min-h-11 min-w-11 flex items-center justify-center text-[#ead6b4]/35 hover:text-[#e8c37a]"
          aria-label="Escuchar a Will"
          title="Escuchar a Will"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
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
    </div>
  );
};
