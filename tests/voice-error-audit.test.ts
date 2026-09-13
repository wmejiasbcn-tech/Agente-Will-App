import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { speakErrorCopy, splitWillSpeech } from '../src/voice/willVoice';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ui = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
const voice = readFileSync(join(root, 'api/voice.ts'), 'utf8');
const BASE = process.env.WILL_BASE || 'http://127.0.0.1:8080';

assert.match(ui, /speakAbort/);
assert.match(ui, /signal\?\.aborted/);
assert.match(ui, /classifiedReason/);
const speakFn = ui.split('async function fetchWillSpeech')[1]?.split('function playOnShared')[0] || '';
assert.equal(speakFn.includes('data?.code'), false);
assert.match(ui, /stall/);
assert.match(voice, /X-Will-Tts-Ms/);
assert.match(voice, /enqueueSpeak\(\(\) => speakWill/);
assert.match(voice, /headersSent/);

assert.match(speakErrorCopy('quota'), /límite de uso/);
assert.match(speakErrorCopy('auth'), /no está disponible/);
assert.match(speakErrorCopy('network'), /no se ha podido generar/);
assert.match(speakErrorCopy('no_tts_key'), /no está disponible/);
assert.equal(speakErrorCopy('quota').includes('no_tts_key'), false);

const long =
  'Entendido. Quieres información concreta sobre la combinación. ' +
  'Los nitritos relajan los vasos. El Viagra dura varias horas. ' +
  'No existe una forma segura que elimine el riesgo cardiovascular. ' +
  'Tú marcas el ritmo y la dirección.';
const parts = splitWillSpeech(long);
assert.equal(parts[0], 'Entendido.');
assert.ok(parts.length >= 2);
assert.ok(parts.slice(1).every((p) => p.length <= 420));

const r = await fetch(`${BASE}/api/voice/speak`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
  body: JSON.stringify({ text: 'Hola. Soy Will.' }),
});
assert.equal(r.status, 200);
const timing = r.headers.get('x-will-tts-ms') || '';
assert.match(timing, /total=\d+/);
assert.equal(r.headers.get('x-will-provider'), 'ElevenLabs');
assert.equal(r.headers.get('x-will-voice'), 'DrwFQsjvHFpLcKyvtbE3');
const empty = await fetch(`${BASE}/api/voice/speak`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '   ' }),
});
assert.equal(empty.status, 400);
const emptyBody = await empty.json();
assert.equal(emptyBody.reason, 'request');

console.log('ok voice error audit', timing);
