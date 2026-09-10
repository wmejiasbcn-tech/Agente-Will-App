import type { Express, Request, Response } from 'express';
import { prepareWillSpeech, WILL_VOICE } from '../src/voice/willVoice';

export function registerVoiceRoutes(app: Express) {
  app.get('/api/voice/config', (_req, res) => {
    res.json({
      provider: WILL_VOICE.provider,
      voiceId: WILL_VOICE.voiceId,
      language: WILL_VOICE.language,
      locale: WILL_VOICE.locale,
      speed: WILL_VOICE.speed,
      elevenLabs: WILL_VOICE.elevenLabs,
      selectedBecause: WILL_VOICE.selectedBecause,
      compared: WILL_VOICE.compared,
      storesAudio: false,
    });
  });

  app.post('/api/voice/speak', async (req: Request, res: Response) => {
    try {
      const raw = typeof req.body?.text === 'string' ? req.body.text : '';
      const text = prepareWillSpeech(raw);
      if (!text) return res.status(400).json({ error: 'No hay texto para leer.' });

      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'El proveedor de voz no está autorizado ahora.',
          fallback: 'browser',
        });
      }

      const r = await fetch('https://api.x.ai/v1/tts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: WILL_VOICE.voiceId,
          language: WILL_VOICE.language,
          speed: WILL_VOICE.speed,
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (!r.ok) {
        return res.status(502).json({
          error: 'La voz de Will no ha podido generarse ahora.',
          fallback: 'browser',
        });
      }

      const buf = Buffer.from(await r.arrayBuffer());
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Will-Voice', WILL_VOICE.voiceId);
      return res.send(buf);
    } catch {
      return res.status(502).json({
        error: 'La voz de Will no está disponible ahora.',
        fallback: 'browser',
      });
    }
  });
}
