import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { generateKokoroSpeech, kokoroIdentity } from '../api/kokoroAdapter';

const id = kokoroIdentity();
assert.equal(id.provider, 'Kokoro');
assert.equal(id.voiceId, 'em_alex');
assert.equal(id.language, 'es');
assert.equal(id.locale, 'es-ES');
assert.notEqual(id.provider, 'ElevenLabs');
assert.notEqual(id.voiceId, 'atlas');
assert.notEqual(id.voiceId, 'DrwFQsjvHFpLcKyvtbE3');

let emptyFailed = false;
try {
  await generateKokoroSpeech('   ');
} catch (error: any) {
  emptyFailed = String(error?.message || '').includes('No hay texto');
}
assert.equal(emptyFailed, true, 'el texto vacío debe fallar a la vista');

const first = await generateKokoroSpeech('Hola. Soy Will. Estoy aquí para acompañarte.');
assert.equal(first.voiceId, 'em_alex');
assert.equal(first.provider, 'Kokoro');
assert.equal(first.mime, 'audio/wav');
assert.ok(first.wav.length > 1000, `audio too small: ${first.wav.length}`);
assert.equal(first.wav.slice(0, 4).toString(), 'RIFF');
assert.ok(first.phonemes.length > 0);
assert.match(first.phonemes, /ola/i);

const second = await generateKokoroSpeech('Sigo aquí. Puedes decirme qué quieres explorar.');
assert.equal(second.voiceId, 'em_alex');
assert.equal(second.provider, 'Kokoro');
assert.ok(second.wav.length > 1000);
assert.equal(second.wav.slice(0, 4).toString(), 'RIFF');
assert.notEqual(second.wav.length, first.wav.length);

mkdirSync('/workspace/artifacts', { recursive: true });
writeFileSync('/tmp/kokoro-em-alex.wav', first.wav);
writeFileSync('/workspace/artifacts/kokoro-em-alex-isolated.wav', first.wav);
writeFileSync('/workspace/artifacts/kokoro-em-alex-consecutive.wav', second.wav);

console.log('ok isolated kokoro', {
  bytes: first.wav.length,
  consecutive: second.wav.length,
  phonemes: first.phonemes.slice(0, 80),
});
