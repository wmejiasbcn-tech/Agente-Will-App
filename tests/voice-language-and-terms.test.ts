import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeVoiceTranscript } from '../api/voice';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const voiceSource = readFileSync(join(root, 'api/voice.ts'), 'utf8');
const chatSource = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');

let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

test('PEP queda canonizado aunque STT lo entregue como Pep', () => {
  assert.equal(normalizeVoiceTranscript('Estoy hablando de Pep'), 'Estoy hablando de PEP');
});

test('DoxyPEP queda canonizado ante variantes fonéticas frecuentes de STT', () => {
  assert.equal(normalizeVoiceTranscript('Qué sabes de dosipep'), 'Qué sabes de DoxyPEP');
  assert.equal(normalizeVoiceTranscript('Qué sabes de Doxy Pep'), 'Qué sabes de DoxyPEP');
  assert.equal(normalizeVoiceTranscript('Qué sabes de DoxyPap'), 'Qué sabes de DoxyPEP');
});

test('El lexicón no actúa como corrector ortográfico general', () => {
  assert.equal(normalizeVoiceTranscript('Tengo una pregunta sobre profilaxis'), 'Tengo una pregunta sobre profilaxis');
});

test('Scribe v2 recibe PEP y DoxyPEP como keyterms', () => {
  assert.match(voiceSource, /const WILL_STT_KEYTERMS = \['PEP', 'DoxyPEP'\]/);
  assert.match(voiceSource, /form\.append\('keyterms', keyterm\)/);
});

test('La primera ruta STT fija castellano para evitar saltos de idioma por autodetección errónea', () => {
  assert.match(voiceSource, /const WILL_STT_LANGUAGE = 'es'/);
  assert.match(voiceSource, /\{ model: 'scribe_v2', language: WILL_STT_LANGUAGE \}/);
});

test('La conversación mantiene castellano salvo cambio explícito y sostenido', () => {
  assert.match(chatSource, /CONVERSATION_LANGUAGE_GUARD/);
  assert.match(chatSource, /Mantén el castellano aunque una transcripción aislada parezca pertenecer a otro idioma/);
});

if (failed) {
  console.error(`ROJO voz/idioma/términos: ${failed}`);
  process.exit(1);
}
console.log('VERDE voz: PEP/DoxyPEP canonizados y continuidad de idioma protegida.');
