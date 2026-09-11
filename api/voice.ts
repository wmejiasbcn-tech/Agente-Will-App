import type { Express, Request, Response } from 'express';

function elevenLabsKey() {
  const raw =
    process.env.ELEVENLABS_API_KEY ||
    process.env.ELEVEN_LABS_API_KEY ||
    process.env.XI_API_KEY ||
    '';
  const key = String(raw)
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^['"]+|['"]+$/g, '')
    .trim();
  if (!key || key.length < 20) return '';
  if (/^(MY_|YOUR_|CHANGE|TODO|PLACEHOLDER|xxx)/i.test(key)) return '';
  return key;
}

const WILL_VOICE_ID = 'DrwFQsjvHFpLcKyvtbE3';
const WILL_MODEL = 'eleven_multilingual_v2';
const WILL_TTS = 'https://api.elevenlabs.io/v1/text-to-speech';

function elevenLabsIdentity() {
  return {
    provider: 'ElevenLabs' as const,
    voiceId: WILL_VOICE_ID,
    modelId: WILL_MODEL,
    language: 'es',
    locale: 'es-ES',
    storesAudio: false,
  };
}

function classifyEleven(status: number, body: string) {
  let reason = '';
  try {
    const parsed = JSON.parse(body);
    const detail = parsed?.detail;
    if (typeof detail === 'string') reason = detail;
    else if (detail && typeof detail === 'object') {
      reason = String(detail.status || detail.message || '');
    } else if (parsed?.status) {
      reason = String(parsed.status);
    }
  } catch {
    reason = body.slice(0, 120);
  }
  const blob = `${status} ${reason}`.toLowerCase();
  if (status === 401 || /invalid_api_key|unauthorized/.test(blob)) return 'auth';
  if (status === 404 || /voice_not_found/.test(blob)) return 'voice';
  if (status === 402 || status === 429 || /quota|credits|limit|concurrency/.test(blob)) {
    return 'quota';
  }
  if (status === 422) return 'request';
  return 'upstream';
}

function userErrorFor(kind: string) {
  if (kind === 'auth') return 'La voz de Will no está disponible ahora.';
  if (kind === 'quota') return 'La voz de Will no está disponible ahora por límite de uso.';
  if (kind === 'voice') return 'La voz de Will no está accesible ahora.';
  return 'La voz de Will no se ha podido generar ahora.';
}

async function requestWillSpeech(apiKey: string, text: string) {
  const url = `${WILL_TTS}/${encodeURIComponent(WILL_VOICE_ID)}?output_format=mp3_44100_128`;
  const headers = {
    'xi-api-key': apiKey,
    'Content-Type': 'application/json',
    Accept: 'audio/mpeg',
  };
  const body = JSON.stringify({
    text,
    model_id: WILL_MODEL,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.8,
    },
  });
  const once = () =>
    fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(20000),
    });
  let r = await once();
  if (r.status === 429 || r.status >= 500) {
    await new Promise((ok) => setTimeout(ok, 600));
    r = await once();
  }
  return r;
}

function prepareWillSpeech(text: string) {
  return text
    .replace(/\*\*/g, '')
    .replace(/[_`#]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 4000);
}

function mimeToName(mime: string) {
  if (mime.includes('mp4') || mime.includes('m4a') || mime.includes('aac')) return 'will.m4a';
  if (mime.includes('ogg')) return 'will.ogg';
  if (mime.includes('mpeg') || mime.includes('mp3')) return 'will.mp3';
  if (mime.includes('wav')) return 'will.wav';
  return 'will.webm';
}

export function registerVoiceRoutes(app: Express) {
  app.get('/api/voice/config', (_req, res) => {
    res.json({
      ...elevenLabsIdentity(),
      listen: Boolean(elevenLabsKey()),
      hasServerKey: Boolean(elevenLabsKey()),
    });
  });

  app.post('/api/voice/listen', async (req: Request, res: Response) => {
      try {
        const apiKey = elevenLabsKey();
        if (!apiKey) {
          return res.status(503).json({ error: 'El reconocimiento de voz no está disponible ahora.' });
        }
        const rawAudio = typeof req.body?.audio === 'string' ? req.body.audio : '';
        const b64 = rawAudio.replace(/^data:[^;]+;base64,/, '');
        const buf = b64 ? Buffer.from(b64, 'base64') : Buffer.alloc(0);
        if (buf.length < 200) {
          return res.status(400).json({ error: 'No ha llegado audio.' });
        }
        const mime = typeof req.body?.mime === 'string' && req.body.mime ? req.body.mime : 'audio/webm';
        const form = new FormData();
        form.append('model_id', 'scribe_v2');
        form.append('language_code', 'es');
        form.append('tag_audio_events', 'false');
        form.append('file', new Blob([new Uint8Array(buf)], { type: mime }), mimeToName(mime));

        let r = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
          method: 'POST',
          headers: { 'xi-api-key': apiKey },
          body: form,
        });
        if (!r.ok) {
          const retry = new FormData();
          retry.append('model_id', 'scribe_v1');
          retry.append('language_code', 'es');
          retry.append('tag_audio_events', 'false');
          retry.append('file', new Blob([new Uint8Array(buf)], { type: mime }), mimeToName(mime));
          r = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
            method: 'POST',
            headers: { 'xi-api-key': apiKey },
            body: retry,
          });
        }
        if (!r.ok) {
          const detail = await r.text().catch(() => '');
          console.error('STT error', r.status, detail.slice(0, 300));
          return res.status(502).json({ error: 'No he podido pasar a escrito lo que has dicho ahora.' });
        }
        const data: any = await r.json();
        const text = String(data?.text || '').replace(/\s+/g, ' ').trim();
        return res.json({ text, storesAudio: false });
      } catch (error: any) {
        console.error('Error in /api/voice/listen', error?.message || error);
        return res.status(502).json({ error: 'No he podido pasar a escrito lo que has dicho ahora.' });
      }
  });

  app.post('/api/voice/speak', async (req: Request, res: Response) => {
    try {
      const raw = typeof req.body?.text === 'string' ? req.body.text : '';
      const text = prepareWillSpeech(raw);
      if (!text) return res.status(400).json({ error: 'No hay texto para leer.' });

      const apiKey = elevenLabsKey();
      if (!apiKey) {
        console.error('TTS speak', { reason: 'no_tts_key', voiceId: WILL_VOICE_ID });
        return res.status(503).json({
          error: 'La voz de Will no está disponible ahora.',
          code: 'SERVER',
          reason: 'no_tts_key',
          voiceId: WILL_VOICE_ID,
          provider: 'ElevenLabs',
        });
      }

      const r = await requestWillSpeech(apiKey, text);
      if (!r.ok) {
        const detail = await r.text().catch(() => '');
        const kind = classifyEleven(r.status, detail);
        console.error('ElevenLabs TTS error', r.status, kind, detail.slice(0, 300));
        return res.status(502).json({
          error: userErrorFor(kind),
          voiceId: WILL_VOICE_ID,
          provider: 'ElevenLabs',
          reason: kind,
          status: r.status,
        });
      }

      const audio = Buffer.from(await r.arrayBuffer());
      if (audio.length < 200) {
        return res.status(502).json({
          error: 'La voz de Will no se ha podido generar ahora.',
          voiceId: WILL_VOICE_ID,
          provider: 'ElevenLabs',
          reason: 'empty',
        });
      }
      res.status(200);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Length', String(audio.length));
      res.setHeader('X-Will-Voice', WILL_VOICE_ID);
      res.setHeader('X-Will-Provider', 'ElevenLabs');
      return res.end(audio);
    } catch (error: any) {
      console.error('Error in /api/voice/speak', error?.message || error);
      return res.status(502).json({
        error: 'La voz de Will no está disponible ahora.',
        voiceId: WILL_VOICE_ID,
        provider: 'ElevenLabs',
        reason: 'exception',
        detail: String(error?.message || error).slice(0, 300),
      });
    }
  });
}
