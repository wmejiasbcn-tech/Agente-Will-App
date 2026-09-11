import type { Express, Request, Response } from 'express';
import { generateKokoroSpeech, kokoroIdentity } from './kokoroAdapter';

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
      ...kokoroIdentity(),
      listen: true,
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

      const spoken = await generateKokoroSpeech(text);
      res.status(200);
      res.setHeader('Content-Type', spoken.mime);
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Length', String(spoken.wav.length));
      res.setHeader('X-Will-Voice', spoken.voiceId);
      res.setHeader('X-Will-Provider', spoken.provider);
      return res.end(spoken.wav);
    } catch (error: any) {
      console.error('Error in /api/voice/speak', error?.message || error);
      return res.status(502).json({
        error: 'La voz de Will no está disponible ahora.',
        voiceId: kokoroIdentity().voiceId,
        reason: 'kokoro',
        provider: 'Kokoro',
      });
    }
  });
}
