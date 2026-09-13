import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import {
  VOICE_STATE_LABEL,
  VoiceUiState,
  getSharedWillAudio,
  splitWillSpeech,
  readVoiceMuted,
  unlockWillAudio,
  writeVoiceMuted,
} from '../voice/willVoice';
import { recordMicDiag } from '../voice/micDiagnostics';
import {
  classifyMicError,
  isWillMicListening,
  readMicBreakLine,
  readMicFailCopy,
  startWillMic,
  stopWillMic,
  subscribeWillMic,
  writeMicBreak,
} from '../voice/micCapture';

interface WillSpeakApi {
  speakingId: string | null;
  loadingId: string | null;
  paused: boolean;
  muted: boolean;
  blockedId: string | null;
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

function writeSpeakBreak(reason: string, http: number) {
  lastSpeakBreak = ['TTS', reason, http ? `http${http}` : ''].filter(Boolean).join(' · ');
}

function readSpeakBreakLine() {
  return lastSpeakBreak;
}

const PUBLISHED_SPEAK = 'https://agente-will-app.vercel.app/api/voice/speak';

function speakUrls(): string[] {
  if (typeof location === 'undefined') return ['/api/voice/speak'];
  if (location.hostname === 'agente-will-app.vercel.app') return ['/api/voice/speak'];
  return [PUBLISHED_SPEAK, '/api/voice/speak'];
}

function classifiedReason(status: number, reason: string) {
  const blob = `${status} ${reason}`.toLowerCase();
  if (reason) return reason;
  if (status === 401 || status === 403) return 'auth';
  if (status === 404) return 'voice';
  if (status === 402 || status === 429) return 'quota';
  if (status === 400 || status === 422) return 'request';
  if (status === 503) return 'no_tts_key';
  if (status >= 500) return 'upstream';
  if (/quota|concurrency|limit/.test(blob)) return 'quota';
  return reason || 'upstream';
}

async function fetchWillSpeech(text: string): Promise<Blob | null> {
  const payload = { text };
  let lastStatus = 0;
  let lastReason = '';
  const urls = speakUrls();
  for (const url of urls) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
          body: JSON.stringify(payload),
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
          const data = await r.json().catch(() => ({} as { reason?: string; code?: string }));
          lastReason = classifiedReason(r.status, String(data?.reason || data?.code || ''));
          if (lastReason === 'auth' || r.status === 401 || r.status === 403) {
            writeSpeakBreak(lastReason, r.status);
            return null;
          }
          if (lastReason === 'quota' || r.status === 429) {
            await new Promise((ok) => setTimeout(ok, 1200 * (attempt + 1)));
            continue;
          }
          if (lastReason === 'no_tts_key' || r.status === 503) break;
        }
      } catch {
        lastReason = 'network';
      }
      if (attempt === 0) {
        await new Promise((ok) => setTimeout(ok, 500));
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

function playOnShared(blob: Blob, gen: number): Promise<'ended' | 'error' | 'stopped' | 'blocked'> {
  const audio = getSharedWillAudio();
  if (!audio) return Promise.resolve('error');
  const url = URL.createObjectURL(blob);
  return new Promise((resolve) => {
    let settled = false;
    const tick = window.setInterval(() => {
      if (playGen !== gen) finish('stopped');
    }, 80);
    const finish = (why: 'ended' | 'error' | 'stopped' | 'blocked') => {
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
    try {
      audio.pause();
    } catch {
      /* ignore */
    }
    audio.loop = false;
    audio.muted = false;
    audio.volume = 1;
    (audio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audio.src = url;
    try {
      audio.currentTime = 0;
    } catch {
      /* El elemento acaba de cambiar de src; play() parte del inicio. */
    }
    const go = audio.play();
    if (go && typeof go.then === 'function') {
      void go.catch((err: unknown) => {
        const name = err && typeof err === 'object' && 'name' in err ? String((err as { name: string }).name) : '';
        if (name === 'NotAllowedError') {
          finish('blocked');
          return;
        }
        audio.muted = false;
        audio.volume = 1;
        const again = audio.play();
        if (again && typeof again.then === 'function') {
          void again.catch((retryErr: unknown) => {
            const retryName =
              retryErr && typeof retryErr === 'object' && 'name' in retryErr
                ? String((retryErr as { name: string }).name)
                : '';
            finish(retryName === 'NotAllowedError' ? 'blocked' : 'error');
          });
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
  const [blockedId, setBlockedId] = useState<string | null>(null);
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
    setBlockedId(null);
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
        if (gen !== playGen) return;
        const blob = await fetchWillSpeech(parts[i]);
        if (gen !== playGen) return;
        if (!blob) {
          setReveal((prev) => ({ ...prev, [id]: text }));
          setError(
            lastSpeakBreak
              ? `La voz de Will no está disponible ahora. ${lastSpeakBreak}. El texto sigue visible.`
              : 'La voz de Will no está disponible ahora. El texto sigue visible.',
          );
          continue;
        }
        shown = shown ? `${shown} ${parts[i]}` : parts[i];
        setReveal((prev) => ({ ...prev, [id]: shown }));
        setLoadingId(null);
        setSpeakingId(id);
        const why = await playOnShared(blob, gen);
        if (gen !== playGen) return;
        if (why === 'blocked') {
          setReveal((prev) => ({ ...prev, [id]: text }));
          setBlockedId(id);
          setError('Toca para escuchar a Will.');
          return;
        }
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
    blockedId,
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
      setBlockedId(null);
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
        writeMicBreak({
          code: 'AUDIO_FORMAT',
          stage: 'blob',
          name: 'EmptyBlob',
          blobSize: 0,
        });
        setState('error');
        return;
      }
      const dataUrl = await blobToDataUrl(blob);
      let r: Response;
      try {
        r = await fetch('/api/voice/listen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: dataUrl, mime: blob.type || 'audio/webm' }),
        });
      } catch (err) {
        writeMicBreak({
          code: 'NETWORK',
          stage: 'upload',
          name: err instanceof Error ? err.name : 'FetchError',
          message: err instanceof Error ? err.message : 'fetch',
          blobType: blob.type,
          blobSize: blob.size,
        });
        recordMicDiag({ type: 'stt_fail', bytes: blob.size, detail: 'network' });
        setState('error');
        return;
      }
      const data = await r.json().catch(() => ({}));
      const spoken = String(data?.text || '').trim();
      if (!r.ok || !spoken) {
        const code =
          r.status === 503
            ? 'SERVER'
            : r.status === 0
              ? 'NETWORK'
              : 'STT';
        writeMicBreak({
          code,
          stage: 'stt',
          name: String(data?.reason || data?.code || r.status),
          message: String(data?.error || r.status),
          blobType: blob.type,
          blobSize: blob.size,
          http: r.status,
        });
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
      writeMicBreak({
        code: 'UNKNOWN',
        stage: 'stt',
        name: 'Exception',
      });
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
    startingRef.current = true;
    setState('preparing_listen');
    try {
      const cfg = await fetch('/api/voice/config')
        .then((r) => r.json())
        .catch(() => ({} as { listen?: boolean }));
      if (cfg && cfg.listen === false) {
        writeMicBreak({
          code: 'SERVER',
          stage: 'stt',
          name: 'NO_STT_KEY',
          http: 503,
        });
        recordMicDiag({ type: 'error', detail: 'NO_STT_KEY' });
        setState('error');
        return;
      }
      unlockWillAudio();
      await startWillMic();
      lockUntil.current = Date.now() + 1200;
      setState('listening');
    } catch (err) {
      recordMicDiag({
        type: 'error',
        detail: classifyMicError(err),
      });
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
        writeMicBreak({
          code: 'AUDIO_FORMAT',
          stage: 'blob',
          name: 'EmptyBlob',
          blobSize: 0,
        });
        setState('error');
        return;
      }
      const dataUrl = await blobToDataUrl(blob);
      let r: Response;
      try {
        r = await fetch('/api/voice/listen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: dataUrl, mime: blob.type || 'audio/webm' }),
        });
      } catch (err) {
        writeMicBreak({
          code: 'NETWORK',
          stage: 'upload',
          name: err instanceof Error ? err.name : 'FetchError',
          message: err instanceof Error ? err.message : 'fetch',
          blobType: blob.type,
          blobSize: blob.size,
        });
        recordMicDiag({ type: 'stt_fail', bytes: blob.size, detail: 'hud network' });
        setState('error');
        return;
      }
      const data = await r.json().catch(() => ({}));
      const spoken = String(data?.text || '').trim();
      if (!r.ok || !spoken) {
        writeMicBreak({
          code: r.status === 503 ? 'SERVER' : 'STT',
          stage: 'stt',
          name: String(data?.reason || data?.code || r.status),
          message: String(data?.error || r.status),
          blobType: blob.type,
          blobSize: blob.size,
          http: r.status,
        });
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
      writeMicBreak({
        code: 'UNKNOWN',
        stage: 'stt',
        name: 'Exception',
      });
      setState('error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="will-mic-dock" role="status" aria-live="polite">
      <p className="will-copy text-[15px]">
        {busy || state === 'transcribing'
          ? 'Procesando lo que has dicho'
          : state === 'preparing_listen'
            ? 'Preparando escucha'
            : `Te estoy escuchando · ${clock}`}
      </p>
      {sec >= 1 && !busy && state !== 'transcribing' ? (
        <button
          type="button"
          id="will-mic-finish"
          onClick={() => void onFinish()}
          className="mt-2 min-h-11 px-4 py-2 text-[14px] will-copy arch-glass"
        >
          He terminado de hablar
        </button>
      ) : (
        <p className="text-[12px] will-copy-muted mt-1">
          Pulsa el micrófono otra vez cuando termines. No te corto yo.
        </p>
      )}
    </div>
  );
};

export const VoiceStateLine: React.FC<{
  state: VoiceUiState;
  error?: string | null;
}> = ({ state, error }) => {
  if (state === 'listening' || isWillMicListening()) return null;
  if (state === 'idle' && !error) return null;
  const breakLine =
    state === 'error' ? readMicBreakLine() : error ? readSpeakBreakLine() : '';
  return (
    <div className="px-1 pb-2" role="status" aria-live="polite">
      <p className="text-[12px] will-copy">
        {error ||
          (state === 'error' ? readMicFailCopy() : VOICE_STATE_LABEL[state])}
      </p>
      {breakLine ? (
        <p
          id={state === 'error' ? 'will-mic-break' : 'will-tts-break'}
          className="font-mono text-[11px] will-copy-muted mt-1"
        >
          {breakLine}
        </p>
      ) : null}
    </div>
  );
};

export const WillTapToListen: React.FC<{
  speak: WillSpeakApi;
  id: string;
  text: string;
}> = ({ speak, id, text }) => {
  if (speak.muted || speak.blockedId !== id) return null;
  return (
    <button
      type="button"
      id="will-tap-to-listen"
      onClick={() => {
        speak.unlock();
        void speak.play(id, text);
      }}
      className="will-listen-gate"
    >
      Toca para escuchar a Will
    </button>
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
