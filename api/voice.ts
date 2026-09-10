import type { Express, Request, Response } from 'express';

const WILL_VOICE_ID = 'DrwFQsjvHFpLcKyvtbE3';
const WILL_MODEL = 'eleven_multilingual_v2';
const WILL_UPSTREAM = 'https://api.elevenlabs.io/v1/text-to-speech';

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
          voiceId: WILL_VOICE_ID,
        });
      }

      const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || WILL_VOICE_ID;
      const url = `${WILL_UPSTREAM}/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`;
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
            stability: 0.52,
            similarity_boost: 0.78,
            style: 0.12,
            use_speaker_boost: true,
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

      const buf = Buffer.from(await r.arrayBuffer());
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Will-Voice', voiceId);
      res.setHeader('X-Will-Provider', 'ElevenLabs');
      return res.send(buf);
    } catch (error: any) {
      console.error('Error in /api/voice/speak', error?.message || error);
      return res.status(502).json({
        error: 'La voz de Will no está disponible ahora.',
        voiceId: WILL_VOICE_ID,
      });
    }
  });
}
