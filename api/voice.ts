import type { Express, Request, Response } from 'express';
import express from 'express';

const WILL_VOICE_ID = 'DrwFQsjvHFpLcKyvtbE3';
const WILL_MODEL = 'eleven_multilingual_v2';
const WILL_UPSTREAM = 'https://api.elevenlabs.io/v1/text-to-speech';
const WILL_STT = 'https://api.elevenlabs.io/v1/speech-to-text';

function elevenLabsKey() {
  return (
    process.env.ELEVENLABS_API_KEY ||
    process.env.ELEVEN_LABS_API_KEY ||
    process.env.XI_API_KEY ||
    ''
  );
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
      provider: 'ElevenLabs',
      voiceId: process.env.ELEVENLABS_VOICE_ID?.trim() || WILL_VOICE_ID,
      modelId: WILL_MODEL,
      language: 'es',
      locale: 'es-ES',
      storesAudio: false,
      hasServerKey: Boolean(elevenLabsKey()),
      listen: true,
    });
  });

  app.post(
    '/api/voice/listen',
    express.raw({ type: () => true, limit: '8mb' }),
    async (req: Request, res: Response) => {
      try {
        const apiKey = elevenLabsKey();
        if (!apiKey) {
          return res.status(503).json({ error: 'Falta la clave de ElevenLabs en el servidor.' });
        }
        const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || []);
        if (!buf.length) {
          return res.status(400).json({ error: 'No ha llegado audio.' });
        }
        const mime =
          (typeof req.headers['x-will-mime'] === 'string' && req.headers['x-will-mime']) ||
          (typeof req.headers['content-type'] === 'string' && req.headers['content-type'] !== 'application/octet-stream'
            ? req.headers['content-type']
            : 'audio/webm');
        const form = new FormData();
        form.append('model_id', 'scribe_v2');
        form.append('language_code', 'es');
        form.append('tag_audio_events', 'false');
        form.append('file', new Blob([new Uint8Array(buf)], { type: mime }), mimeToName(mime));

        let r = await fetch(WILL_STT, {
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
          r = await fetch(WILL_STT, {
            method: 'POST',
            headers: { 'xi-api-key': apiKey },
            body: retry,
          });
        }
        if (!r.ok) {
          const detail = await r.text().catch(() => '');
          console.error('ElevenLabs STT error', r.status, detail.slice(0, 300));
          return res.status(502).json({ error: 'No he podido pasar a escrito lo que has dicho ahora.' });
        }
        const data: any = await r.json();
        const text = String(data?.text || '').replace(/\s+/g, ' ').trim();
        return res.json({ text, storesAudio: false });
      } catch (error: any) {
        console.error('Error in /api/voice/listen', error?.message || error);
        return res.status(502).json({ error: 'No he podido pasar a escrito lo que has dicho ahora.' });
      }
    },
  );

  app.post('/api/voice/speak', async (req: Request, res: Response) => {
    try {
      const raw = typeof req.body?.text === 'string' ? req.body.text : '';
      const text = prepareWillSpeech(raw);
      if (!text) return res.status(400).json({ error: 'No hay texto para leer.' });

      const apiKey = elevenLabsKey();
      if (!apiKey) {
        return res.status(503).json({
          error: 'Falta la clave de ElevenLabs en el servidor.',
          voiceId: WILL_VOICE_ID,
        });
      }

      const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || WILL_VOICE_ID;
      const url = `${WILL_UPSTREAM}/${encodeURIComponent(voiceId)}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: WILL_MODEL,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
          },
        }),
      });

      if (!r.ok) {
        const detail = await r.text().catch(() => '');
        console.error('ElevenLabs TTS error', r.status, detail.slice(0, 300));
        return res.status(502).json({
          error: 'ElevenLabs no ha podido generar la voz ahora.',
          voiceId,
        });
      }

      const audio = Buffer.from(await r.arrayBuffer());
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Will-Voice', voiceId);
      res.setHeader('X-Will-Provider', 'ElevenLabs');
      return res.send(audio);
    } catch (error: any) {
      console.error('Error in /api/voice/speak', error?.message || error);
      return res.status(502).json({
        error: 'La voz de Will no está disponible ahora.',
        voiceId: WILL_VOICE_ID,
      });
    }
  });
}
