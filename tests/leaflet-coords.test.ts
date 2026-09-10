import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORLD_NODES } from '../src/data/worldNodes';
import { wgsToImage } from '../src/utils/mapGeoref';
import { lonLatToMercator, mercatorToLonLat } from '../src/utils/webMercator';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

async function test(name: string, fn: () => void) {
  try {
    fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

await test('Web Mercator es reversible en una ciudad', () => {
  const nyc = { lat: 40.7128, lng: -74.006 };
  const back = mercatorToLonLat(lonLatToMercator(nyc));
  assert.ok(Math.abs(back.lat - nyc.lat) < 1e-6);
  assert.ok(Math.abs(back.lng - nyc.lng) < 1e-6);
});

await test('Un GCP proyectado cae sobre su propio píxel', () => {
  for (const n of WORLD_NODES) {
    const p = wgsToImage(n.lat, n.lng);
    assert.ok(Math.abs(p.x - n.x) < 2, `${n.label} x ${p.x} vs ${n.x}`);
    assert.ok(Math.abs(p.y - n.y) < 2, `${n.label} y ${p.y} vs ${n.y}`);
  }
});

await test('Nueva York no cae en Colorado; Buenos Aires no cae en Colombia; Mumbai no cae en Arabia', () => {
  const nyc = wgsToImage(40.7128, -74.006);
  const colorado = wgsToImage(39.0, -105.5);
  const bue = wgsToImage(-34.6037, -58.3816);
  const bog = wgsToImage(4.711, -74.0721);
  const bom = wgsToImage(19.076, 72.8777);
  const dxb = wgsToImage(25.2048, 55.2708);
  assert.ok(nyc.x > colorado.x + 4, 'Nueva York al este de Colorado');
  assert.ok(bue.y > bog.y + 8, 'Buenos Aires al sur de Bogotá');
  assert.ok(bom.x > dxb.x + 6, 'Mumbai al este de Dubái');
});

await test('Leaflet usa el mapamundi de Will, no teselas OSM como héroe', () => {
  const map = readFileSync(join(root, 'src/components/WillWorldMap.tsx'), 'utf8');
  const geo = readFileSync(join(root, 'api/geo.ts'), 'utf8');
  assert.match(map, /L\.CRS\.Simple/);
  assert.match(map, /imageOverlay/);
  assert.match(map, /MAP_IMAGE.src/);
  assert.match(readFileSync(join(root, 'src/data/worldNodes.ts'), 'utf8'), /world-map-screen\.jpg/);
  assert.equal(map.includes('tileLayer'), false);
  assert.equal(map.includes('openstreetmap.org/{z}'), false);
  assert.match(geo, /\/api\/geo\/geocode/);
  assert.match(geo, /photon\.komoot\.io/);
  assert.match(geo, /nominatim\.openstreetmap\.org/);
});

if (failed) {
  console.error(`ROJO leaflet-coords: ${failed}`);
  process.exit(1);
}
console.log('VERDE proyección + Leaflet sobre el mapamundi de Will');
