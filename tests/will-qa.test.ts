import assert from 'node:assert/strict';
import { extractLanguageLayers } from '../src/data/spokenLanguages';
import { WILL_VOICE, prepareWillSpeech } from '../src/voice/willVoice';
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

await test('VOICE config Atlas documentada', async () => {
  const r = await fetch(`${BASE}/api/voice/config`);
  const data = await r.json();
  assert.equal(data.voiceId, 'atlas');
  assert.equal(data.language, 'es');
  assert.equal(data.storesAudio, false);
  assert.equal(data.elevenLabs, 'no_key');
  assert.ok(WILL_VOICE.compared.includes('atlas'));
});

await test('VOICE speak genera audio y no lo guarda en la respuesta JSON', async () => {
  const r = await fetch(`${BASE}/api/voice/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Hola. Soy Will.' }),
  });
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type') || '', /audio/);
  assert.equal(r.headers.get('cache-control'), 'no-store');
  const buf = Buffer.from(await r.arrayBuffer());
  assert.ok(buf.length > 1000);
  assert.equal(buf[0] === 0xff || buf.slice(0, 3).toString() === 'ID3', true);
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
