import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  buildCompatReport,
  inferEngine,
  micWorksWithoutSpeechRecognition,
  pickRecorderMime,
  sourceUsesChromeOnlyGate,
  type CompatEnv,
} from '../src/utils/browserCompat';

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

function env(partial: Partial<CompatEnv>): CompatEnv {
  return {
    protocol: 'https:',
    getUserMedia: true,
    mediaRecorder: true,
    geolocation: true,
    audioElement: true,
    webAudio: true,
    speechRecognition: false,
    ...partial,
  };
}

await test('El motor se infiere para el informe, no para abrir o cerrar funciones', () => {
  assert.equal(inferEngine('Mozilla/5.0 Firefox/128.0'), 'gecko');
  assert.equal(inferEngine('Mozilla/5.0 Chrome/128.0 Safari/537.36'), 'chromium');
  assert.equal(inferEngine('Mozilla/5.0 Version/17.0 Safari/605.1.15'), 'webkit');
  assert.equal(inferEngine('NavegadorDesconocido/0.1'), 'unknown');
  assert.equal(inferEngine('Comet/1.0 Chrome/128'), 'chromium');
});

await test('Firefox sin SpeechRecognition puede capturar audio', () => {
  const report = buildCompatReport(
    env({
      userAgent: 'Mozilla/5.0 Firefox/128.0',
      speechRecognition: false,
      isTypeSupported: (t) => t.includes('ogg') || t === 'audio/webm',
    }),
  );
  assert.equal(report.engine, 'gecko');
  assert.equal(report.speechRecognition, false);
  assert.equal(report.mic.canCapture, true);
  assert.equal(micWorksWithoutSpeechRecognition(report), true);
  assert.ok(report.mic.mime.includes('webm') || report.mic.mime.includes('ogg'));
});

await test('Safari/WebKit usa mp4 si es lo que soporta', () => {
  const report = buildCompatReport(
    env({
      userAgent: 'Mozilla/5.0 Version/17.0 Safari/605.1.15',
      speechRecognition: false,
      isTypeSupported: (t) => t.includes('mp4'),
    }),
  );
  assert.equal(report.engine, 'webkit');
  assert.equal(report.mic.mime, 'audio/mp4');
  assert.equal(report.mic.canCapture, true);
});

await test('Chrome no es requisito: Comet/Neo sin reconocimiento de voz también capturan', () => {
  for (const ua of ['Comet/1.0 Chrome/128', 'Neo/0.9 Chrome/128', 'Brave/1.0 Chrome/128']) {
    const report = buildCompatReport(
      env({
        userAgent: ua,
        speechRecognition: false,
        isTypeSupported: (t) => t.includes('webm'),
      }),
    );
    assert.equal(report.mic.canCapture, true);
    assert.equal(micWorksWithoutSpeechRecognition(report), true);
  }
});

await test('Un navegador desconocido sin tipos de mime conocidos sigue pudiendo grabar', () => {
  const report = buildCompatReport(
    env({
      userAgent: 'NavegadorDeBarrio/3.2',
      speechRecognition: false,
      isTypeSupported: () => false,
    }),
  );
  assert.equal(report.engine, 'unknown');
  assert.equal(report.mic.mime, '');
  assert.equal(report.mic.canCapture, true);
});

await test('Sin getUserMedia o sin MediaRecorder no se finge compatibilidad', () => {
  const noMic = buildCompatReport(env({ getUserMedia: false }));
  const noRec = buildCompatReport(env({ mediaRecorder: false }));
  assert.equal(noMic.mic.canCapture, false);
  assert.equal(noRec.mic.canCapture, false);
});

await test('pickRecorderMime no asume Chrome: elige el primer tipo realmente soportado', () => {
  assert.equal(pickRecorderMime((t) => t === 'audio/ogg'), 'audio/ogg');
  assert.equal(pickRecorderMime((t) => t === 'audio/mp4'), 'audio/mp4');
  assert.equal(pickRecorderMime(() => false), '');
});

await test('El micrófono no usa SpeechRecognition ni un filtro de Chrome', () => {
  const mic = readFileSync(join(root, 'src/voice/micCapture.ts'), 'utf8');
  const voice = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
  assert.equal(mic.includes('SpeechRecognition'), false);
  assert.equal(voice.includes('webkitSpeechRecognition'), false);
  assert.equal(sourceUsesChromeOnlyGate(mic), false);
  assert.equal(sourceUsesChromeOnlyGate(voice), false);
  assert.equal(sourceUsesChromeOnlyGate("if (isChrome) startMic()"), true);
});

await test('Reproducir voz no depende de window.speechSynthesis', () => {
  const voice = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
  assert.equal(voice.includes('speechSynthesis'), false);
  assert.match(voice, /playsinline/i);
});

if (failed) {
  console.error(`ROJO compat multinavegador: ${failed}`);
  process.exit(1);
}
console.log('VERDE compat multinavegador');
