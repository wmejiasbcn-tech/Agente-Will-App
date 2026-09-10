import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, Pause, Play, Square, Volume2 } from 'lucide-react';
import { VOICE_STATE_LABEL, VoiceUiState } from '../voice/willVoice';

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


function pickRecorderMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || '';
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
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const seedRef = useRef('');

  const release = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recRef.current = null;
    chunks.current = [];
  };

  const transcribe = async (blob: Blob, seed: string) => {
    setState('transcribing');
    try {
      const r = await fetch('/api/voice/listen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Will-Mime': blob.type || 'audio/webm',
        },
        body: blob,
      });
      const data = await r.json().catch(() => ({}));
      const spoken = String(data?.text || '').trim();
      if (!r.ok || !spoken) {
        setState('error');
        return;
      }
      const next = seed ? `${seed} ${spoken}` : spoken;
      onTranscript(next, true);
      setState('idle');
    } catch {
      setState('error');
    }
  };

  const stopListen = () => {
    const rec = recRef.current;
    if (!rec || rec.state === 'inactive') {
      release();
      if (state === 'listening') setState('idle');
      return;
    }
    rec.stop();
  };

  const startListen = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setState('error');
      return;
    }
    seedRef.current = currentText;
    chunks.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickRecorderMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recRef.current = rec;
      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.current.push(ev.data);
      };
      rec.onerror = () => {
        release();
        setState('error');
      };
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: rec.mimeType || 'audio/webm' });
        const seed = seedRef.current.trim();
        release();
        if (blob.size < 800) {
          setState('idle');
          return;
        }
        void transcribe(blob, seed);
      };
      rec.start(250);
      setState('listening');
    } catch {
      release();
      setState('error');
    }
  };

  useEffect(
    () => () => {
      try {
        if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
      } catch {
        /* unmount */
      }
      release();
    },
    [],
  );

  const active = state === 'listening';
  const busy = state === 'transcribing';

  return (
    <button
      type="button"
      id="will-mic-btn"
      disabled={disabled || busy}
      onClick={() => (active ? stopListen() : startListen())}
      className={`p-2.5 min-h-11 min-w-11 shrink-0 flex items-center justify-center ${
        active || busy ? 'text-[#e8c37a] will-mic-live' : 'text-[#ead6b4]/35 hover:text-[#e8c37a]'
      }`}
      aria-pressed={active}
      aria-label={active ? 'Dejar de hablar' : 'Hablar con Will'}
      title={active ? 'Dejar de hablar' : 'Hablar con Will'}
    >
      <Mic className={`w-4 h-4 ${active || busy ? '' : 'opacity-80'}`} />
    </button>
  );
};

export const VoiceStateLine: React.FC<{
  state: VoiceUiState;
  error?: string | null;
}> = ({ state, error }) => {
  if (state === 'idle' && !error) return null;
  return (
    <p className="text-[12px] will-copy px-1 pb-2" role="status" aria-live="polite">
      {error || VOICE_STATE_LABEL[state]}
      {state === 'listening' ? ' Sigue abierto hasta que pulses de nuevo el micrófono.' : ''}
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
