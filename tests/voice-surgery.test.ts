import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const voice = readFileSync(join(root, 'api/voice.ts'), 'utf8');
const adapter = readFileSync(join(root, 'api/kokoroAdapter.ts'), 'utf8');
const ui = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
const core = readFileSync(join(root, 'src/voice/willVoice.ts'), 'utf8');
const chat = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
const explore = readFileSync(join(root, 'src/components/ExploreTopicsView.tsx'), 'utf8');

assert.match(adapter, /em_alex/);
assert.match(adapter, /Kokoro/);
assert.match(voice, /generateKokoroSpeech/);
assert.match(voice, /DrwFQsjvHFpLcKyvtbE3/);
assert.match(voice, /elevenlabs\.io\/v1\/text-to-speech/);
assert.match(voice, /api\.x\.ai\/v1\/stt/);
assert.match(voice, /XAI_API_KEY/);
assert.match(voice, /indexOf\('base64,'\)/);
assert.equal(voice.includes('speechSynthesis'), false);
assert.equal(voice.includes('elevenlabs.io/v1/speech-to-text'), false);
assert.equal(voice.includes('scribe_v2'), false);
assert.equal(core.includes('speechSynthesis'), false);
assert.equal(ui.includes('speechSynthesis'), false);
assert.match(core, /DrwFQsjvHFpLcKyvtbE3/);
assert.match(core, /WILL_VOICE_LAB/);
assert.match(ui, /for \(let attempt = 0; attempt < 2/);
assert.match(ui, /audio\.pause\(\)/);
assert.match(ui, /readVoiceLab/);
assert.equal(chat.includes('handleSend(next.quickPrompt'), false);
assert.match(explore, /useState<CanonicalDomainId \| null>/);
assert.equal(explore.includes("|| 'acompanamiento'"), false);

console.log('ok voice surgery isolation');
