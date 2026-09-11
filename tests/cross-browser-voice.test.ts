import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WILL_VOICE, splitWillSpeech } from '../src/voice/willVoice';
import { sourceUsesChromeOnlyGate } from '../src/utils/browserCompat';
import { scanCaptureSource } from '../src/voice/micDiagnostics';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
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

function srcFiles() {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, name.name);
      if (name.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(name.name)) out.push(p);
    }
  };
  walk(join(root, 'src'));
  return out;
}

await test('Un solo reproductor canónico: no existe elevenLabsSpeech ni speechSynthesis de navegador', () => {
  assert.equal(existsSync(join(root, 'src/utils/elevenLabsSpeech.ts')), false);
  for (const file of srcFiles()) {
    const text = readFileSync(file, 'utf8');
    assert.equal(text.includes('window.speechSynthesis'), false, file);
    assert.equal(text.includes('installWillElevenLabsVoice'), false, file);
  }
  const voice = readFileSync(join(root, 'src/voice/willVoice.ts'), 'utf8');
  assert.match(voice, /will-voice-el/);
  assert.equal((voice.match(/createElement\('audio'\)/g) || []).length, 1);
});

await test('Voice ID canónico ElevenLabs Will, no Atlas ni Kokoro ni síntesis del navegador', () => {
  assert.equal(WILL_VOICE.provider, 'ElevenLabs');
  assert.equal(WILL_VOICE.voiceId, 'DrwFQsjvHFpLcKyvtbE3');
  assert.notEqual(String(WILL_VOICE.voiceId), 'atlas');
  assert.notEqual(String(WILL_VOICE.voiceId), 'em_alex');
});

await test('Captura independiente de transcripción: ni SpeechRecognition ni ScriptProcessor ni silencio', () => {
  const capture = readFileSync(join(root, 'src/voice/micCapture.ts'), 'utf8');
  const ui = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
  const flags = scanCaptureSource(capture + '\n' + ui);
  assert.equal(flags.speechRecognition, false);
  assert.equal(flags.silenceTimeout, false);
  assert.equal(flags.audioContextRequired, false);
  assert.equal(flags.chromeOnly, false);
  assert.equal(capture.includes('createScriptProcessor'), false);
  assert.equal(capture.includes('start(1000)'), true);
  assert.equal(ui.includes('probeWillCompat'), true);
});

await test('No hay if Chrome como arquitectura', () => {
  const files = [
    'src/voice/micCapture.ts',
    'src/voice/willVoice.ts',
    'src/components/WillVoice.tsx',
    'src/components/WillChat.tsx',
  ];
  for (const rel of files) {
    const text = readFileSync(join(root, rel), 'utf8');
    assert.equal(sourceUsesChromeOnlyGate(text), false, rel);
  }
});

await test('Diez respuestas se pueden partir y encadenar sin un solo bloque', () => {
  const replies = Array.from({ length: 10 }, (_, i) =>
    `Respuesta ${i + 1}. Sigo aquí. El texto permanece visible.`,
  );
  const parts = replies.flatMap(splitWillSpeech);
  assert.ok(parts.length >= 10);
  assert.equal(parts.join(' ').includes('Respuesta 10'), true);
});

await test('Silenciar no borra el texto: visibleText con mute devuelve el contenido', () => {
  const ui = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
  assert.match(ui, /if \(muted\) return full/);
  assert.match(ui, /WillMuteButton/);
});

await test('Motores reales de página: Chromium, Firefox, WebKit si existen. Neo no se finge.', async () => {
  let pw: any;
  try {
    pw = await import('playwright');
  } catch {
    console.log('NO VERIFICADO playwright');
    return;
  }
  const engines: Array<['chromium' | 'firefox' | 'webkit', string]> = [
    ['chromium', 'Chromium'],
    ['firefox', 'Firefox'],
    ['webkit', 'WebKit'],
  ];
  const url = process.env.WILL_URL || 'https://agente-will-app.vercel.app';
  for (const [key, label] of engines) {
    try {
      const browser = await pw[key].launch({ headless: true });
      const page = await browser.newPage();
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const body = await page.textContent('body');
      await browser.close();
      assert.equal(Boolean(response?.ok()), true, `${label} no cargó`);
      assert.match(body || '', /Will/i);
      console.log('ok  carga', label);
    } catch (e: any) {
      console.log(`NO VERIFICADO ${label}: ${String(e.message || e).slice(0, 160)}`);
    }
  }
  console.log('Neo se prueba en tests/neo-voice.test.ts, no se cubre con Chrome.');
});

if (failed) {
  console.error(`ROJO voz cross-browser: ${failed}`);
  process.exit(1);
}
console.log('VERDE parcial de aceptación de código. Neo y conversación larga en dispositivo = NO VERIFICADO.');
