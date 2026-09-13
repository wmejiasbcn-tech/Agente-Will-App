import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  cleanSttMime,
  mixToMono,
  pcm16WavBytes,
  resampleLinear,
} from '../src/voice/sttPrepare';
import { micErrorCopy } from '../src/voice/willVoice';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

assert.equal(cleanSttMime('audio/webm;codecs=opus'), 'audio/webm');
assert.equal(cleanSttMime('audio/mp4;codecs=mp4a.40.2'), 'audio/mp4');
assert.equal(cleanSttMime('audio/wav'), 'audio/wav');
assert.equal(cleanSttMime(''), 'audio/webm');

const mono = mixToMono([new Float32Array([1, -1]), new Float32Array([1, 1])]);
assert.equal(mono.length, 2);
assert.ok(Math.abs(mono[0] - 1) < 1e-6);
assert.ok(Math.abs(mono[1]) < 1e-6);

const up = resampleLinear(new Float32Array([0, 1]), 8000, 16000);
assert.equal(up.length, 4);
assert.ok(Math.abs(up[0]) < 1e-6);
assert.ok(Math.abs(up[up.length - 1] - 1) < 1e-6);

const wav = pcm16WavBytes(new Float32Array(1600).fill(0.2), 16000);
assert.equal(String.fromCharCode(wav[0], wav[1], wav[2], wav[3]), 'RIFF');
assert.equal(String.fromCharCode(wav[8], wav[9], wav[10], wav[11]), 'WAVE');
assert.ok(wav.length > 44);

const ui = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
assert.match(ui, /prepareSttBlob/);
assert.match(ui, /cleanSttMime/);
assert.equal(ui.includes('SpeechRecognition'), false);
assert.equal(ui.includes('webkitSpeechRecognition'), false);

const css = readFileSync(join(root, 'src/index.css'), 'utf8');
assert.equal(css.includes('42vh'), false);
assert.equal(css.includes('field-sizing'), false);
assert.match(css, /\.will-composer \{[\s\S]*?flex-direction:\s*row/);

const chat = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
assert.match(chat, /will-composer-tools/);
assert.match(chat, /placeholder="Escribe o habla\.\.\."/);

assert.match(micErrorCopy('unheard'), /no he entendido/);
assert.match(micErrorCopy('stt'), /pasar a escrito/);

const voice = readFileSync(join(root, 'api/voice.ts'), 'utf8');
assert.match(voice, /cleanSttMime/);
assert.match(voice, /scribe_v2/);
assert.equal(voice.includes('api.x.ai/v1/stt'), false);

console.log('ok stt prepare and compact composer');
