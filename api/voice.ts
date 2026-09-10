import type { Express, Request, Response } from 'express';
import { prepareWillSpeech, WILL_VOICE } from '../src/voice/willVoice';

function elevenLabsKey() {
  return (
    process.env.ELEVENLABS_API_KEY ||
    process.env.ELEVEN_LABS_API_KEY ||
    process.env.XI_API_KEY ||
    ''
  );
}

export function registerVoiceRoutes(app: Express) {
  app.get('/api/voice/config', (_req, res) => {
    res.json({
      provider: WILL_VOICE.provider,
      voiceId: WILL_VOICE.voiceId,
      modelId: WILL_VOICE.modelId,
      language: WILL_VOICE.language,
      locale: WILL_VOICE.locale,
      storesAudio: false,
      hasServerKey: Boolean(elevenLabsKey()),
    });
  });

  app.post('/api/voice/speak', async (req: Request, res: Response) => {
    try {
      const raw = typeof req.body?.text === 'string' ? req.body.text : '';
      const text = prepareWillSpeech(raw);
      if (!text) return res.status(400).json({ error: 'No hay texto para leer.' });

      const apiKey = elevenLabsKey();
      if (!apiKey) {
        return res.status(503).json({
          error: 'Falta la clave de ElevenLabs en el servidor.',
          voiceId: WILL_VOICE.voiceId,
        });
      }

      const voiceId =
        process.env.ELEVENLABS_VOICE_ID?.trim() || WILL_VOICE.voiceId;

      const url = `${WILL_VOICE.upstream}/${voiceId}?output_format=${WILL_VOICE.outputFormat}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: WILL_VOICE.modelId,
          voice_settings: {
            stability: 0.52,
            similarity_boost: 0.78,
            style: 0.12,
            use_speaker_boost: true,
          },
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!r.ok) {
        return res.status(502).json({
          error: 'ElevenLabs no ha podido generar la voz ahora.',
          voiceId: WILL_VOICE.voiceId,
        });
      }

      const buf = Buffer.from(await r.arrayBuffer());
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Will-Voice', voiceId);
      res.setHeader('X-Will-Provider', 'ElevenLabs');
      return res.send(buf);
    } catch {
      return res.status(502).json({
        error: 'La voz de Will no está disponible ahora.',
        voiceId: WILL_VOICE.voiceId,
      });
    }
  });
}
