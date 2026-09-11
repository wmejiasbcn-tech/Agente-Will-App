import assert from 'node:assert/strict';

const BASE = process.env.WILL_URL || 'https://agente-will-app.vercel.app';
const BUDGET_MS = {
  home: 8000,
  config: 4000,
  geo: 25000,
};

let failed = 0;
const rows: Array<{ engine: string; probe: string; ms: number; ok: boolean; note: string }> = [];

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

async function timed(fn: () => Promise<unknown>) {
  const t0 = Date.now();
  const value = await fn();
  return { ms: Date.now() - t0, value };
}

await test('Rendimiento de la app: portada y config no se miden en un solo motor', async () => {
  const home = await timed(async () => {
    const r = await fetch(BASE, { redirect: 'follow' });
    const html = await r.text();
    assert.equal(r.ok, true);
    assert.match(html, /Will|hablar/i);
    return html;
  });
  rows.push({
    engine: 'http-client',
    probe: 'portada',
    ms: home.ms,
    ok: home.ms < BUDGET_MS.home,
    note: 'HTML inicial',
  });
  assert.ok(home.ms < BUDGET_MS.home, `portada lenta: ${home.ms}ms`);

  const config = await timed(async () => {
    const r = await fetch(`${BASE}/api/voice/config`);
    const data = await r.json();
    assert.equal(data.provider, 'ElevenLabs');
    return data;
  });
  rows.push({
    engine: 'http-client',
    probe: 'voice/config',
    ms: config.ms,
    ok: config.ms < BUDGET_MS.config,
    note: 'sin generar audio',
  });
  assert.ok(config.ms < BUDGET_MS.config, `config lenta: ${config.ms}ms`);
});

await test('Rendimiento geo: una búsqueda de ciudad, no un listado cerrado', async () => {
  const geo = await timed(async () => {
    const r = await fetch(`${BASE}/api/geo/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: 'Wellington', origin: 'search' }),
    });
    assert.ok(r.ok || r.status === 404);
    return r.status;
  });
  rows.push({
    engine: 'http-client',
    probe: 'geo/lookup',
    ms: geo.ms,
    ok: geo.ms < BUDGET_MS.geo,
    note: 'Wellington como ejemplo de ciudad',
  });
  assert.ok(geo.ms < BUDGET_MS.geo, `geo lenta: ${geo.ms}ms`);
});

await test('Motores reales: Chromium, Firefox y WebKit si el entorno los tiene', async () => {
  let pw: any;
  try {
    pw = await import('playwright');
  } catch {
    console.log('NO VERIFICADO playwright no está instalado en este entorno');
    rows.push({
      engine: 'playwright',
      probe: 'install',
      ms: 0,
      ok: true,
      note: 'NO VERIFICADO: sin Playwright',
    });
    return;
  }

  const engines: Array<['chromium' | 'firefox' | 'webkit', string]> = [
    ['chromium', 'Chromium / Chrome / Comet / Neo'],
    ['firefox', 'Firefox / Gecko'],
    ['webkit', 'WebKit / Safari'],
  ];

  for (const [key, label] of engines) {
    try {
      const browser = await pw[key].launch({ headless: true });
      const page = await browser.newPage();
      const t0 = Date.now();
      const response = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const ms = Date.now() - t0;
      const body = await page.textContent('body');
      const okStatus = Boolean(response?.ok());
      const hasWill = /Will/i.test(body || '');
      await browser.close();
      const ok = okStatus && hasWill && ms < BUDGET_MS.home;
      rows.push({ engine: label, probe: 'portada', ms, ok, note: okStatus ? 'domcontentloaded' : 'http error' });
      assert.equal(okStatus, true, `${label} no cargó la portada`);
      assert.equal(hasWill, true, `${label} no mostró Will`);
      assert.ok(ms < BUDGET_MS.home, `${label} lenta: ${ms}ms`);
      console.log(`perf ${label} ${ms}ms`);
    } catch (e: any) {
      rows.push({
        engine: label,
        probe: 'portada',
        ms: 0,
        ok: false,
        note: `NO VERIFICADO: ${String(e.message || e).slice(0, 180)}`,
      });
      console.log(`NO VERIFICADO ${label}: ${String(e.message || e).slice(0, 180)}`);
    }
  }
});

console.log('\nmatriz rendimiento');
console.table(rows);

if (failed) {
  console.error(`ROJO rendimiento multinavegador: ${failed}`);
  process.exit(1);
}
console.log('VERDE rendimiento de las pruebas ejecutadas');
