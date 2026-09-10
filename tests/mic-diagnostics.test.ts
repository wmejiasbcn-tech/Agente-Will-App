import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isolateMicCause,
  resetMicDiag,
  recordMicDiag,
  scanCaptureSource,
  type MicDiagEvent,
} from '../src/voice/micDiagnostics';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

async function test(name: string, fn: () => void) {
  try {
    fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

function log(types: Array<MicDiagEvent['type'] | [MicDiagEvent['type'], number]>): MicDiagEvent[] {
  const t0 = 1_000_000;
  return types.map((item, i) => {
    if (Array.isArray(item)) {
      return { t: t0 + item[1], type: item[0] };
    }
    return { t: t0 + i * 200, type: item };
  });
}

await test('Aísla ghost click cuando stop llega en el mismo gesto', () => {
  const v = isolateMicCause(log([['start', 0], ['user_stop', 180], ['stt_start', 200]]));
  assert.equal(v.cause, 'ghost_click');
  assert.equal(v.confidence, 'alta');
});

await test('Aísla STT sobre un onstop inesperado', () => {
  const v = isolateMicCause(
    log(['start', 'unexpected_stop', 'stt_start', 'stt_ok']),
  );
  assert.equal(v.cause, 'unexpected_stop_stt');
});

await test('Aísla SpeechRecognition por bandera, no por paleta', () => {
  const v = isolateMicCause(log(['start', 'idle']), { speechRecognition: true });
  assert.equal(v.cause, 'speech_recognition');
});

await test('Aísla timeout de silencio', () => {
  const v = isolateMicCause(log(['start', 'idle']), { silenceTimeout: true });
  assert.equal(v.cause, 'silence_timeout');
});

await test('Aísla captura atada a Chrome', () => {
  const v = isolateMicCause(log(['start']), { chromeOnly: true });
  assert.equal(v.cause, 'chrome_only');
});

await test('Un fin explícito no se diagnostica como corte', () => {
  const v = isolateMicCause(log([['start', 0], ['user_stop', 4000], ['stt_ok', 4200]]));
  assert.equal(v.cause, 'user_ended');
});

await test('El registro de eventos alimenta el veredicto', () => {
  resetMicDiag();
  recordMicDiag({ type: 'start', t: 10 });
  recordMicDiag({ type: 'unexpected_stop', t: 800 });
  recordMicDiag({ type: 'stt_start', t: 820 });
  const v = isolateMicCause();
  assert.equal(v.cause, 'unexpected_stop_stt');
  assert.match(v.nextPatch, /start\(1000\)/);
});

await test('El código de captura de Will no arrastra las causas ya cerradas', () => {
  const source = [
    readFileSync(join(root, 'src/voice/micCapture.ts'), 'utf8'),
    readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8'),
  ].join('\n');
  const flags = scanCaptureSource(source);
  assert.equal(flags.speechRecognition, false);
  assert.equal(flags.chromeOnly, false);
  assert.equal(flags.silenceTimeout, false);
  assert.equal(flags.audioContextRequired, false);
});

if (failed) {
  console.error(`ROJO diagnóstico de audio: ${failed}`);
  process.exit(1);
}
console.log('VERDE diagnóstico de audio');
