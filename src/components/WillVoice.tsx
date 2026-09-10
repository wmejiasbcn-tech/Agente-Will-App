import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, Pause, Play, Square, Volume2 } from 'lucide-react';
import {
  speechRecognitionCtor,
  VOICE_STATE_LABEL,
  VoiceUiState,
  WILL_VOICE,
} from '../voice/willVoice';

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
  const recRef = useRef<SpeechRecognition | null>(null);
  const keepOn = useRef(false);
  const seedRef = useRef('');

  const stopListen = () => {
    keepOn.current = false;
    try {
      recRef.current?.stop();
    } catch {
      /* already stopped */
    }
    recRef.current = null;
    setState('idle');
  };

  const attach = (rec: SpeechRecognition) => {
    rec.lang = WILL_VOICE.locale;
    rec.interimResults = true;
    rec.continuous = true;
    rec.onstart = () => setState('listening');
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        keepOn.current = false;
        setState('error');
        return;
      }
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      if (!keepOn.current) setState('error');
    };
    rec.onend = () => {
      if (!keepOn.current) {
        recRef.current = null;
        setState('idle');
        return;
      }
      try {
        rec.start();
      } catch {
        window.setTimeout(() => {
          if (!keepOn.current) return;
          try {
            rec.start();
          } catch {
            keepOn.current = false;
            recRef.current = null;
            setState('idle');
          }
        }, 180);
      }
    };
    rec.onresult = (ev) => {
      let spoken = '';
      for (let i = 0; i < ev.results.length; i++) {
        spoken += ev.results[i][0].transcript;
      }
      spoken = spoken.trim();
      const seed = seedRef.current.trim();
      const next = seed ? `${seed} ${spoken}` : spoken;
      onTranscript(next, ev.results[ev.results.length - 1]?.isFinal ?? false);
    };
  };

  const startListen = () => {
    const Ctor = speechRecognitionCtor();
    if (!Ctor) {
      setState('error');
      return;
    }
    keepOn.current = true;
    seedRef.current = currentText;
    const rec = new Ctor();
    attach(rec);
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      keepOn.current = false;
      setState('error');
    }
  };

  useEffect(() => () => {
    keepOn.current = false;
    try {
      recRef.current?.stop();
    } catch {
      /* unmount */
    }
  }, []);

  const active = state === 'listening';

  return (
    <button
      type="button"
      id="will-mic-btn"
      disabled={disabled}
      onClick={() => (active ? stopListen() : startListen())}
      className={`p-2.5 min-h-11 min-w-11 shrink-0 flex items-center justify-center ${
        active ? 'text-[#e8c37a] will-mic-live' : 'text-[#ead6b4]/35 hover:text-[#e8c37a]'
      }`}
      aria-pressed={active}
      aria-label={active ? 'Dejar de escuchar' : 'Hablar con Will'}
      title={active ? 'Dejar de escuchar' : 'Hablar con Will'}
    >
      <Mic className={`w-4 h-4 ${active ? '' : 'opacity-80'}`} />
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
      {state === 'listening' ? ' El micrófono sigue abierto hasta que lo cierres.' : ''}
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
