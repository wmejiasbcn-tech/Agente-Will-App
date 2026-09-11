import assert from 'node:assert/strict';
import { extractLanguageLayers } from '../src/data/spokenLanguages';
import { prepareWillSpeech } from '../src/voice/willVoice';
import { looksLikeCoordinates, readGeoLeaksFromStorage } from '../src/utils/geoPrivacy';

const BASE = process.env.WILL_URL || 'http://127.0.0.1:8080';

let failed = 0;
async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

function mockStorage(entries: Record<string, string>) {
  const keys = Object.keys(entries);
  return {
    length: keys.length,
    key: (i: number) => keys[i] ?? null,
    getItem: (k: string) => (k in entries ? entries[k] : null),
  };
}

await test('GEO mundial: ciudades de ejemplo, no un listado cerrado', async () => {
  const samples = ['Wellington', 'Alicante'];
  for (const q of samples) {
    const r = await fetch(`${BASE}/api/geo/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, origin: 'search' }),
    });
    const data = await r.json();
    assert.ok(r.status === 200 || data.absence === 'place_not_found' || data.absence === 'no_map_hits');
    if (r.status === 200) {
      assert.equal(data.origin, 'search');
      assert.equal(data.privacy.stored, false);
      assert.notEqual(data.origin, 'gps');
    }
  }
});

await test('GEO name:en no es atención en inglés', () => {
  const layers = extractLanguageLayers({ name: 'Clínica', 'name:en': 'Clinic' });
  assert.equal(layers.careLanguages.includes('en'), false);
  assert.ok(layers.nameLanguages.includes('en'));
});

await test('PRIV almacenamiento limpio', () => {
  assert.deepEqual(readGeoLeaksFromStorage(mockStorage({ theme: 'dark' })), []);
  assert.equal(looksLikeCoordinates('Hola Will'), false);
});

await test('VOICE config ElevenLabs Will', async () => {
  const r = await fetch(`${BASE}/api/voice/config`);
  const data = await r.json();
  assert.equal(data.provider, 'ElevenLabs');
  assert.equal(data.voiceId, 'DrwFQsjvHFpLcKyvtbE3');
  assert.equal(data.modelId, 'eleven_multilingual_v2');
  assert.equal(data.storesAudio, false);
  assert.equal(data.voiceId === 'atlas', false);
  assert.equal(data.lab?.voiceId, 'em_alex');
});

await test('VOICE speak usa ElevenLabs cuando hay clave; si no, no cae a Kokoro', async () => {
  const cfg = await fetch(`${BASE}/api/voice/config`).then((r) => r.json());
  const r = await fetch(`${BASE}/api/voice/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Hola. Soy Will.' }),
  });
  if (!cfg.hasServerKey) {
    assert.equal(r.status, 503);
    const body = await r.json();
    assert.equal(body.reason, 'no_tts_key');
    assert.equal(body.voiceId, 'DrwFQsjvHFpLcKyvtbE3');
    assert.equal(body.provider, 'ElevenLabs');
    return;
  }
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type') || '', /audio/);
  assert.equal(r.headers.get('cache-control'), 'no-store');
  assert.equal(r.headers.get('x-will-voice'), 'DrwFQsjvHFpLcKyvtbE3');
  assert.equal(r.headers.get('x-will-provider'), 'ElevenLabs');
  const buf = Buffer.from(await r.arrayBuffer());
  assert.ok(buf.length > 1000);
});

await test('VOICE lab Kokoro em_alex sigue accesible', async () => {
  const r = await fetch(`${BASE}/api/voice/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Hola. Soy Will.', engine: 'kokoro' }),
  });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('x-will-voice'), 'em_alex');
  assert.equal(r.headers.get('x-will-provider'), 'Kokoro');
  const buf = Buffer.from(await r.arrayBuffer());
  assert.ok(buf.length > 1000);
  assert.equal(buf.slice(0, 4).toString(), 'RIFF');
});

await test('VOICE prepare no inventa texto', () => {
  const out = prepareWillSpeech('**Hola**\n\nSoy Will.');
  assert.match(out, /Hola/);
  assert.ok(!out.includes('**'));
});

await test('UI salud', async () => {
  const r = await fetch(`${BASE}/`);
  assert.equal(r.status, 200);
  const html = await r.text();
  assert.match(html, /Will/);
  const health = await fetch(`${BASE}/api/health`);
  assert.equal(health.ok, true);
});

if (failed) {
  console.error(`\n${failed} pruebas QA fallidas`);
  process.exit(1);
}
console.log('\nQA geo + voz: verde parcial según evidencias de este archivo.');
