import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitWillSpeech } from '../src/voice/willVoice';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ui = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
const voice = readFileSync(join(root, 'api/voice.ts'), 'utf8');
const BASE = process.env.WILL_BASE || 'http://127.0.0.1:8080';

assert.equal(ui.includes('pending ='), false);
assert.match(ui, /const blob = await fetchWillSpeech\(parts\[i\]/);
assert.match(ui, /for \(let attempt = 0; attempt < 2/);
assert.match(ui, /classifiedReason/);
assert.match(voice, /reason: 'quota'|reason: kind/);
assert.match(voice, /enqueueSpeak/);
assert.match(voice, /no_tts_key/);
assert.match(voice, /reason: 'empty'/);
assert.match(voice, /reason: 'exception'/);
assert.match(voice, /DrwFQsjvHFpLcKyvtbE3/);
assert.match(voice, /eleven_multilingual_v2/);
assert.match(voice, /visorTtsOrigin\(\)/);

const long = Array.from({ length: 12 }, (_, i) =>
  `Esta es la frase número ${i + 1} de una respuesta larga de Will sobre reducción de riesgos.`,
).join(' ');
const parts = splitWillSpeech(long);
assert.ok(parts.length >= 2, `chunks ${parts.length}`);
assert.ok(parts[0].includes('número 1'));
assert.equal(parts[0].includes('número 2'), false);
assert.ok(parts.every((p) => p.length <= 420 || p === parts[0]), JSON.stringify(parts.map((p) => p.length)));

const turns = [
  'Hola, buenos días. Aquí estoy.',
  'Dime, ¿en qué dudas te puedo acompañar?',
  'Esto tiene matices. Déjame analizarlo con cuidado.',
  'El texto sigue visible aunque la voz se recupere.',
  'Tú marcas el ritmo y la dirección.',
  'No hay una forma segura que elimine todo el riesgo.',
  'Si quieres, seguimos con lo que más te preocupa ahora.',
  'Puedes parar cuando quieras. No te empujo.',
  'Lo importante es que estés acompañado con información clara.',
  'Sigo aquí. Cuéntame con calma.',
];

const results: Array<{ n: number; status: number; type: string; bytes: number; reason: string }> = [];
for (let n = 0; n < turns.length; n++) {
  const r = await fetch(`${BASE}/api/voice/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text: turns[n] }),
  });
  const type = r.headers.get('content-type') || '';
  const buf = Buffer.from(await r.arrayBuffer());
  let reason = '';
  if (!r.ok) {
    try {
      reason = JSON.parse(buf.toString()).reason || '';
    } catch {
      reason = buf.toString().slice(0, 80);
    }
  }
  results.push({ n: n + 1, status: r.status, type, bytes: buf.length, reason });
  assert.notEqual(reason, 'no_tts_key', JSON.stringify(results));
  assert.equal(r.status, 200, JSON.stringify(results));
  assert.match(type, /audio\/mpeg/);
  assert.ok(buf.length > 1000);
  assert.notEqual(buf.slice(0, 4).toString(), 'RIFF');
  assert.equal(r.headers.get('x-will-provider'), 'ElevenLabs');
  assert.equal(r.headers.get('x-will-voice'), 'DrwFQsjvHFpLcKyvtbE3');
}

const empty = await fetch(`${BASE}/api/voice/speak`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '   ' }),
});
assert.equal(empty.status, 400);
const emptyBody = await empty.json();
assert.equal(emptyBody.reason, 'request');

const recovered = await fetch(`${BASE}/api/voice/speak`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
  body: JSON.stringify({ text: 'Sigo aquí después del fallo.' }),
});
assert.equal(recovered.status, 200);
assert.match(recovered.headers.get('content-type') || '', /audio\/mpeg/);
const recoveredBuf = Buffer.from(await recovered.arrayBuffer());
assert.ok(recoveredBuf.length > 1000);
assert.notEqual(recovered.headers.get('x-will-provider'), null);

console.log('ok voice long conversation', results.map((r) => r.bytes).join(','), 'recover', recoveredBuf.length);
