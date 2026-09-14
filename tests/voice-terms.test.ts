import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const voice = readFileSync(join(root, 'src/voice/willVoice.ts'), 'utf8');
const capture = readFileSync(join(root, 'src/voice/micCapture.ts'), 'utf8');

const canonicalTerms = ['PrEP', 'PEP', 'DoxyPEP'];

for (const term of canonicalTerms) {
  assert.ok(voice.includes(term), `Falta término canonizado en voz: ${term}`);
  assert.ok(capture.includes(term), `Falta término canonizado en captura/STT: ${term}`);
}

assert.match(voice, /PrEP/);
assert.match(voice, /PEP/);
assert.match(voice, /DoxyPEP/);

console.log('VERDE términos de voz canonizados: PrEP, PEP y DoxyPEP.');
