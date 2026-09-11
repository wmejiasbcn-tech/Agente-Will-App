import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Express, Request, Response } from 'express';
import { formatKokoroTimings, kokoroIdentity } from './kokoroAdapter';

function xaiKey() {
  const raw = process.env.XAI_API_KEY || '';
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

function wantsKokoroLab(req: Request) {
  const q = String(req.query?.engine || req.query?.lab || '').toLowerCase();
  const bodyEngine = typeof req.body?.engine === 'string' ? req.body.engine.toLowerCase() : '';
  return q === 'kokoro' || bodyEngine === 'kokoro' || bodyEngine === 'em_alex';
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
  if (mime.includes('opus')) return 'will.opus';
  return 'will.webm';
}

function looksLikeWav(mime: string, buf: Buffer) {
  if (/wav|wave/i.test(mime)) return true;
  return (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WAVE'
  );
}

function needsWavWrap(mime: string, buf: Buffer) {
  if (looksLikeWav(mime, buf)) return false;
  if (/webm/i.test(mime)) return true;
  if (buf.length >= 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
    return true;
  }
  return false;
}

function runFfmpegToWav(inputPath: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(
      'ffmpeg',
      ['-y', '-i', inputPath, '-ac', '1', '-ar', '16000', '-f', 'wav', outputPath],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
    let stderr = '';
    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk);
      if (stderr.length > 400) stderr = stderr.slice(-400);
    });
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('ffmpeg timeout'));
    }, 12000);
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg ${code} ${stderr.slice(0, 180)}`));
    });
  });
}

async function wrapAsWav(buf: Buffer, mime: string): Promise<{ buf: Buffer; mime: string }> {
  if (!needsWavWrap(mime, buf)) return { buf, mime: looksLikeWav(mime, buf) ? 'audio/wav' : mime };
  const dir = await mkdtemp(join(tmpdir(), 'will-stt-'));
  const input = join(dir, mimeToName(mime || 'audio/webm'));
  const output = join(dir, 'will.wav');
  try {
    await writeFile(input, buf);
    await runFfmpegToWav(input, output);
    const wav = await readFile(output);
    if (wav.length < 200) throw new Error('wav vacío');
    return { buf: wav, mime: 'audio/wav' };
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

async function transcribeWithXai(apiKey: string, buf: Buffer, mime: string) {
  const form = new FormData();
  form.append('format', 'true');
  form.append('language', 'es');
  form.append('keyterm', 'Will');
  form.append('file', new Blob([new Uint8Array(buf)], { type: mime }), mimeToName(mime));
  const r = await fetch('https://api.x.ai/v1/stt', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    signal: AbortSignal.timeout(25000),
  });
  const detail = r.ok ? '' : (await r.text().catch(() => '')).slice(0, 300);
  return { r, detail };
}

export function registerVoiceRoutes(app: Express) {
  app.get('/api/voice/config', (_req, res) => {
    res.json({
      ...elevenLabsIdentity(),
      listen: Boolean(xaiKey()),
      hasServerKey: Boolean(elevenLabsKey()),
      lab: { ...kokoroIdentity(), role: 'experimental' },
    });
  });

  app.post('/api/voice/listen', async (req: Request, res: Response) => {
      try {
        const rawAudio = typeof req.body?.audio === 'string' ? req.body.audio : '';
        const marker = rawAudio.indexOf('base64,');
        const b64 = marker >= 0 ? rawAudio.slice(marker + 7) : rawAudio.replace(/^data:[^,]*,/, '');
        const incoming = b64 ? Buffer.from(b64, 'base64') : Buffer.alloc(0);
        const incomingMime =
          typeof req.body?.mime === 'string' && req.body.mime ? req.body.mime : 'audio/webm';
        const bytes = incoming.length;

        if (bytes < 200) {
          console.error('STT listen', { reason: 'empty_audio', bytes, mime: incomingMime.slice(0, 40) });
          return res.status(400).json({
            error: 'No ha llegado audio.',
            code: 'AUDIO_FORMAT',
            reason: 'empty_audio',
            bytes,
            mime: incomingMime.slice(0, 80),
          });
        }

        const apiKey = xaiKey();
        if (!apiKey) {
          console.error('STT listen', { reason: 'no_stt_key', bytes, mime: incomingMime.slice(0, 40) });
          return res.status(503).json({
            error: 'El reconocimiento de voz no está disponible ahora.',
            code: 'SERVER',
            reason: 'no_stt_key',
            bytes,
            mime: incomingMime.slice(0, 80),
          });
        }

        let payload = { buf: incoming, mime: incomingMime };
        try {
          payload = await wrapAsWav(incoming, incomingMime);
        } catch (wrapErr: any) {
          console.error('STT wrap', String(wrapErr?.message || wrapErr).slice(0, 180));
        }

        let { r, detail } = await transcribeWithXai(apiKey, payload.buf, payload.mime);
        if (!r.ok && payload.mime !== 'audio/wav') {
          try {
            const retry = await wrapAsWav(incoming, incomingMime);
            if (retry.mime === 'audio/wav' && retry.buf.length >= 200) {
              const second = await transcribeWithXai(apiKey, retry.buf, retry.mime);
              r = second.r;
              detail = second.detail;
              payload = retry;
            }
          } catch (wrapErr: any) {
            console.error('STT wrap retry', String(wrapErr?.message || wrapErr).slice(0, 180));
          }
        }
        if (!r.ok) {
          console.error('STT error', r.status, detail, {
            bytes,
            mime: incomingMime.slice(0, 40),
            sent: payload.mime,
          });
          return res.status(502).json({
            error: 'No he podido pasar a escrito lo que has dicho ahora.',
            code: 'STT',
            reason: 'upstream',
            status: r.status,
            bytes,
            mime: incomingMime.slice(0, 80),
          });
        }
        const data: any = await r.json();
        const text = String(data?.text || '').replace(/\s+/g, ' ').trim();
        return res.json({ text, storesAudio: false });
      } catch (error: any) {
        console.error('Error in /api/voice/listen', error?.message || error);
        return res.status(502).json({
          error: 'No he podido pasar a escrito lo que has dicho ahora.',
          code: 'NETWORK',
          reason: 'network',
        });
      }
  });

  app.post('/api/voice/speak', async (req: Request, res: Response) => {
    try {
      const raw = typeof req.body?.text === 'string' ? req.body.text : '';
      const text = prepareWillSpeech(raw);
      if (!text) return res.status(400).json({ error: 'No hay texto para leer.' });

      if (wantsKokoroLab(req)) {
        const { generateKokoroSpeech } = await import('./kokoroAdapter');
        const spoken = await generateKokoroSpeech(text);
        res.status(200);
        res.setHeader('Content-Type', spoken.mime);
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Length', String(spoken.wav.length));
        res.setHeader('X-Will-Voice', spoken.voiceId);
        res.setHeader('X-Will-Provider', spoken.provider);
        res.setHeader('X-Will-Voice-Ms', formatKokoroTimings(spoken.timings));
        res.setHeader('X-Will-Lab', 'experimental');
        return res.end(spoken.wav);
      }

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
