import assert from 'node:assert/strict';

const BASE = process.env.WILL_URL || 'http://127.0.0.1:8080';

async function post(body: unknown) {
  const r = await fetch(`${BASE}/api/geo/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  return { status: r.status, data };
}

let failed = 0;
async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

await test('búsqueda de Tokio no se guarda y no es GPS', async () => {
  const { status, data } = await post({
    q: 'Tokio',
    origin: 'search',
    languages: ['en'],
    languageMode: 'prioritize',
  });
  assert.equal(status, 200);
  assert.equal(data.privacy.stored, false);
  assert.equal(data.privacy.keptAfterResponse, false);
  assert.equal(data.origin, 'search');
  assert.ok(data.label);
  assert.ok(Array.isArray(data.sites));
  assert.ok(data.mapEmbedUrl);
  assert.ok(data.privacy.sent.some((s: any) => s.fields.includes('q')));
  assert.equal(
    data.privacy.sent.some((s: any) => s.fields.includes('q') && data.origin === 'gps'),
    false,
  );
});

await test('ausencia de lugar ≠ ausencia de recurso', async () => {
  const { status, data } = await post({
    q: 'zzzxxxyyy-lugar-que-no-existe-will',
    origin: 'search',
  });
  assert.equal(status, 404);
  assert.equal(data.absence, 'place_not_found');
  assert.equal(data.privacy.stored, false);
});

await test('GPS y búsqueda son orígenes distintos', async () => {
  const search = await post({ q: 'Ushuaia', origin: 'search' });
  assert.equal(search.data.origin, 'search');
  assert.equal(search.data.privacy.stored, false);
  const gps = await post({
    lat: -54.8019,
    lng: -68.303,
    origin: 'gps',
  });
  assert.equal(gps.data.origin, 'gps');
  assert.equal(gps.data.privacy.stored, false);
  assert.notEqual(search.data.origin, 'gps');
});

await test('ficha de recurso trae fuente', async () => {
  const { data } = await post({ q: 'Tokio', origin: 'search' });
  if (data.sites?.length) {
    const site = data.sites[0];
    assert.equal(site.source.name, 'OpenStreetMap');
    assert.ok(site.mapsUrl);
    assert.ok(Array.isArray(site.careLanguages));
    assert.ok(Array.isArray(site.nameLanguages));
  }
});

if (failed) {
  console.error(`\n${failed} pruebas funcionales fallidas`);
  process.exit(1);
}
console.log('\nPruebas funcionales Recursos v2: verde.');
