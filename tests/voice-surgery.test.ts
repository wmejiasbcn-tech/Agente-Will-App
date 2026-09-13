import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const voice = readFileSync(join(root, 'api/voice.ts'), 'utf8');
const bundle = readFileSync(join(root, 'api/vercel.cjs'), 'utf8');
const ui = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
const core = readFileSync(join(root, 'src/voice/willVoice.ts'), 'utf8');
const chat = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
const explore = readFileSync(join(root, 'src/components/ExploreTopicsView.tsx'), 'utf8');
const vercelJson = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));

assert.equal(voice.includes('generateKokoroSpeech'), false);
assert.equal(voice.includes('wantsKokoroLab'), false);
assert.equal(voice.includes('em_alex'), false);
assert.equal(voice.includes('engine === \'kokoro\''), false);
assert.match(voice, /DrwFQsjvHFpLcKyvtbE3/);
assert.match(voice, /eleven_multilingual_v2/);
assert.match(bundle, /DrwFQsjvHFpLcKyvtbE3/);
assert.match(bundle, /elevenlabs\.io\/v1\/text-to-speech/);
assert.match(bundle, /eleven_multilingual_v2/);
assert.equal(bundle.includes('kokoro-js'), false);
assert.equal(bundle.includes('generateKokoroSpeech'), false);
assert.equal(bundle.includes('em_alex'), false);
assert.equal(bundle.includes('wantsKokoroLab'), false);
assert.match(voice, /elevenlabs\.io\/v1\/text-to-speech/);
assert.match(voice, /elevenlabs\.io\/v1\/speech-to-text/);
assert.match(voice, /scribe_v2/);
assert.match(voice, /enqueueSpeak/);
assert.match(voice, /visorTtsOrigin\(\)/);
assert.equal(voice.includes('speechSynthesis'), false);
assert.equal(voice.includes('api.x.ai/v1/stt'), false);
assert.equal(core.includes('speechSynthesis'), false);
assert.equal(ui.includes('speechSynthesis'), false);
assert.match(core, /DrwFQsjvHFpLcKyvtbE3/);
assert.equal(core.includes('WILL_VOICE_LAB'), false);
assert.equal(core.includes('readVoiceLab'), false);
assert.match(ui, /const blob = await fetchWillSpeech\(parts\[i\]/);
assert.equal(ui.includes('pending ='), false);
assert.match(ui, /for \(let attempt = 0; attempt < 2/);
assert.match(ui, /audio\.pause\(\)/);
assert.equal(ui.includes('readVoiceLab'), false);
assert.equal(ui.includes("engine: 'kokoro'"), false);
assert.match(ui, /TTS · no_tts_key · http503|lastSpeakBreak/);
assert.equal(chat.includes('handleSend(next.quickPrompt'), false);
assert.match(explore, /useState<CanonicalDomainId \| null>/);
assert.equal(explore.includes("|| 'acompanamiento'"), false);
assert.equal('functions' in vercelJson, false);
assert.ok(Array.isArray(vercelJson.builds));
assert.equal(JSON.stringify(vercelJson).includes('kokoro'), false);
assert.equal(
  vercelJson.builds.some((b) => b.src === 'api/vercel.cjs' && b.use === '@vercel/node'),
  true,
);

console.log('ok voice surgery isolation');
