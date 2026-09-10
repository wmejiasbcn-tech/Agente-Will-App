import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const voice = readFileSync(join(root, 'api/voice.ts'), 'utf8');
const ui = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
const core = readFileSync(join(root, 'src/voice/willVoice.ts'), 'utf8');
const chat = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
const explore = readFileSync(join(root, 'src/components/ExploreTopicsView.tsx'), 'utf8');

assert.match(voice, /DrwFQsjvHFpLcKyvtbE3/);
assert.match(voice, /eleven_multilingual_v2/);
assert.match(voice, /output_format=mp3_44100_128/);
assert.match(voice, /reason: kind/);
assert.equal(voice.includes('speechSynthesis'), false);
assert.equal(core.includes('speechSynthesis'), false);
assert.equal(ui.includes('speechSynthesis'), false);
assert.match(ui, /for \(let attempt = 0; attempt < 2/);
assert.match(ui, /audio\.pause\(\)/);
assert.equal(chat.includes('handleSend(next.quickPrompt'), false);
assert.match(explore, /useState<CanonicalDomainId \| null>/);
assert.equal(explore.includes("|| 'acompanamiento'"), false);

console.log('ok voice surgery isolation');
