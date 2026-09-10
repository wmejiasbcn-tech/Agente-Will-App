import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildCompatReport,
  inferEngine,
  micWorksWithoutSpeechRecognition,
  sourceUsesChromeOnlyGate,
  type CompatEnv,
} from '../src/utils/browserCompat';
import { scanCaptureSource } from '../src/voice/micDiagnostics';
import { WILL_VOICE } from '../src/voice/willVoice';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.WILL_URL || 'https://agente-will-app.vercel.app';
const NEO_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Neo/1.0';

let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

function neoEnv(partial: Partial<CompatEnv> = {}): CompatEnv {
  return {
    userAgent: NEO_UA,
    protocol: 'https:',
    getUserMedia: true,
    mediaRecorder: true,
    speechRecognition: false,
    audioElement: true,
    webAudio: false,
    geolocation: true,
    isTypeSupported: (t) => t.includes('webm'),
    ...partial,
  };
}

await test('Neo es criterio de aceptación: captura sin SpeechRecognition y sin Chrome', () => {
  const report = buildCompatReport(neoEnv());
  assert.equal(report.speechRecognition, false);
  assert.equal(report.mic.canCapture, true);
  assert.equal(micWorksWithoutSpeechRecognition(report), true);
  assert.equal(report.audio.element, true);
});

await test('Neo sin Web Audio sigue pudiendo reproducir a Will', () => {
  const report = buildCompatReport(neoEnv({ webAudio: false }));
  assert.equal(report.audio.webAudio, false);
  assert.equal(report.audio.element, true);
});

await test('Si Neo no tiene getUserMedia, Will degrada: no captura, no se rompe el informe', () => {
  const report = buildCompatReport(neoEnv({ getUserMedia: false }));
  assert.equal(report.mic.canCapture, false);
  assert.equal(report.audio.element, true);
});

await test('El código de voz no cierra Neo por ser distinto de Chrome', () => {
  const capture = readFileSync(join(root, 'src/voice/micCapture.ts'), 'utf8');
  const voice = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
  const chat = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
  const flags = scanCaptureSource(capture + '\n' + voice);
  assert.equal(flags.speechRecognition, false);
  assert.equal(flags.chromeOnly, false);
  assert.equal(sourceUsesChromeOnlyGate(capture), false);
  assert.equal(sourceUsesChromeOnlyGate(voice), false);
  assert.equal(sourceUsesChromeOnlyGate(chat), false);
  assert.equal(WILL_VOICE.voiceId, 'DrwFQsjvHFpLcKyvtbE3');
});

await test('inferEngine no es un permiso: Neo se informa, las APIs deciden', () => {
  assert.equal(inferEngine(NEO_UA), 'chromium');
  const report = buildCompatReport(neoEnv({ userAgent: NEO_UA, speechRecognition: false }));
  assert.equal(report.mic.canCapture, true);
});

await test('Neo en el navegador: entrar a Hablar con Will sin SpeechRecognition', async () => {
  let pw: any;
  try {
    pw = await import('playwright');
  } catch {
    throw new Error('Playwright no está. Neo no se puede probar en este entorno.');
  }
  const executablePath = process.env.NEO_BROWSER_PATH || undefined;
  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
  });
  const context = await browser.newContext({
    userAgent: NEO_UA,
    locale: 'es-ES',
    extraHTTPHeaders: { 'Accept-Language': 'es-ES,es;q=0.9' },
  });
  await context.addInitScript(() => {
    const w = window as Window & {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    try {
      delete w.SpeechRecognition;
      delete w.webkitSpeechRecognition;
    } catch {
      w.SpeechRecognition = undefined;
      w.webkitSpeechRecognition = undefined;
    }
  });
  const page = await context.newPage();
  const response = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 25000 });
  assert.equal(Boolean(response?.ok()), true, 'Neo-perfil no cargó Will');
  const nav = page.getByRole('button', { name: 'Hablar con Will' }).first();
  if (await nav.count()) {
    await nav.click();
  }
  await page.waitForSelector('#chat-user-input', { timeout: 15000 });
  const placeholder = await page.getAttribute('#chat-user-input', 'placeholder');
  assert.match(placeholder || '', /habla/i);
  const mute = await page.getByRole('button', { name: /silenciar|activar voz/i }).count();
  assert.ok(mute > 0, 'Falta el control de silencio en Neo');
  const mic = await page.getByRole('button', { name: /Hablar con Will|He terminado de hablar/i }).count();
  assert.ok(mic > 0, 'Falta el micrófono en Neo');
  const live = await page.evaluate(() => {
    const w = window as Window & {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
      __willCompat?: { canTalk?: () => { capture: boolean; chromeRequired: boolean } };
      MediaRecorder?: unknown;
      navigator: Navigator;
    };
    return {
      speech: Boolean(w.SpeechRecognition || w.webkitSpeechRecognition),
      mediaRecorder: typeof w.MediaRecorder === 'function',
      getUserMedia: Boolean(w.navigator.mediaDevices?.getUserMedia),
      ua: w.navigator.userAgent,
      probe: w.__willCompat?.canTalk?.() || null,
    };
  });
  await browser.close();
  assert.match(live.ua, /Neo/i);
  assert.equal(live.speech, false, 'Neo no debe depender de SpeechRecognition');
  assert.equal(live.mediaRecorder, true);
  assert.equal(live.getUserMedia, true);
  if (live.probe) {
    assert.equal(live.probe.chromeRequired, false);
    assert.equal(live.probe.capture, true);
  }
});

if (failed) {
  console.error(`ROJO Neo: ${failed}`);
  process.exit(1);
}
console.log('VERDE perfil Neo (Playwright como Neo, sin SpeechRecognition). El binario Neo del usuario, si existe, se usa con NEO_BROWSER_PATH.');
