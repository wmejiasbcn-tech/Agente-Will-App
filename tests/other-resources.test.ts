import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORLD_NODES } from '../src/data/worldNodes';
import { CAPITALS } from '../src/data/capitals';
import { WILL_HEALTH_SITES, isCivicOrCulturalName, isMaternityName, isPrivateCare, isWillThemeName } from '../api/willHealthSites';

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

const view = readFileSync(join(root, 'src/components/OtherResourcesView.tsx'), 'utf8');
const nav = readFileSync(join(root, 'src/components/Navbar.tsx'), 'utf8');
const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');

await test('El nombre canónico es Otros recursos, no un alias', () => {
  assert.match(nav, /label: 'Otros recursos'/);
  assert.match(view, />\s*Otros recursos\s*</);
  assert.equal(nav.includes('Explorar el mundo'), false);
  assert.equal(nav.includes('Recursos cerca de ti'), false);
  assert.equal(nav.includes('Apoyo donde estés'), false);
});

await test('Quinta estancia al mismo nivel que las otras cuatro', () => {
  assert.match(app, /other-resources/);
  assert.match(app, /'how-it-works', 'other-resources'/);
  assert.match(nav, /id: 'other-resources'/);
});

await test('No hay GPS automático ni persistencia de ubicación', () => {
  assert.equal(view.includes('requestUserCoords()'), true);
  assert.equal(view.includes('localStorage'), false);
  assert.equal(view.includes('sessionStorage'), false);
  assert.match(view, /assertNoGeoPersistence/);
  assert.match(view, /'gps'/);
  assert.match(view, /'search'/);
});

await test('Ausencia de resultados no afirma que el recurso no exista', () => {
  assert.match(view, /No hemos encontrado resultados para esta búsqueda/);
  assert.equal(view.includes('Este recurso no existe'), false);
});

await test('El mapamundi de referencia está en el producto, sin Notebook', () => {
  assert.equal(existsSync(join(root, 'public/visual-system/world-map.jpg')), true);
  assert.equal(existsSync(join(root, 'public/visual-system/world-map-screen.jpg')), true);
  const bytes = readFileSync(join(root, 'public/visual-system/world-map.jpg'));
  assert.equal(bytes.includes(Buffer.from('Gemini')), false);
  assert.equal(bytes.includes(Buffer.from('Notebook')), false);
  assert.match(view, /WillWorldMap/);
});

await test('Los puntos del mapa son entradas, no un catálogo cerrado del planeta', () => {
  assert.ok(WORLD_NODES.length >= 15);
  assert.equal(WORLD_NODES.some((n) => n.query === 'Tokio'), true);
  assert.match(view, /other-resources-search/);
  assert.match(view, /Usar mi ubicación/);
});

await test('Nueva York, Buenos Aires y Mumbai caen en su tierra, no en otra', () => {
  const nyc = WORLD_NODES.find((n) => n.id === 'nyc')!;
  const bue = WORLD_NODES.find((n) => n.id === 'bue')!;
  const bog = WORLD_NODES.find((n) => n.id === 'bog')!;
  const bom = WORLD_NODES.find((n) => n.id === 'bom')!;
  const dxb = WORLD_NODES.find((n) => n.id === 'dxb')!;
  assert.ok(nyc.x > 24, 'Nueva York tiene que estar al este, no en Colorado');
  assert.ok(bue.y > 78, 'Buenos Aires tiene que estar en el cono sur, no en Colombia');
  assert.ok(bue.y > bog.y, 'Buenos Aires más al sur que Bogotá');
  assert.ok(bom.x > dxb.x + 4, 'Mumbai al este de Dubái, no en Arabia');
  assert.match(view, /WillWorldMap/);
});

await test('Accesible sin el mapa: búsqueda, labels y teclado', () => {
  assert.match(view, /htmlFor="other-resources-search"/);
  assert.match(view, /WillWorldMap/);
  assert.match(view, /Buscar ciudad, región, país/);
});

await test('Hay capitales del planeta y el buscador sigue abierto a cualquier ciudad', () => {
  assert.ok(CAPITALS.length >= 150);
  assert.equal(CAPITALS.some((c) => c.name === 'Buenos Aires'), true);
  assert.equal(CAPITALS.some((c) => c.name === 'Madrid'), true);
  const map = readFileSync(join(root, 'src/components/WillWorldMap.tsx'), 'utf8');
  assert.match(map, /CAPITALS/);
  assert.match(view, /other-resources-search/);
});

await test('Los resultados no son un listado de farmacias ni de centros cívicos', () => {
  const geo = readFileSync(join(root, 'api/geo.ts'), 'utf8');
  assert.equal(/nwr\["amenity"="community_centre"\]/.test(geo), false);
  assert.equal(geo.includes('amenity"="pharmacy'), false);
  assert.match(geo, /salud sexual/);
  assert.match(geo, /drug_addiction/);
  assert.match(geo, /WILL_HEALTH_SITES/);
});

await test('Barcelona tiene Checkpoint, Stop, CJAS, Drassanes y Pere Virgili, no centros cívicos', () => {
  const names = WILL_HEALTH_SITES.filter((s) => s.city === 'Barcelona').map((s) => s.name);
  assert.ok(names.some((n) => /Checkpoint/i.test(n)));
  assert.ok(names.some((n) => /Stop/i.test(n)));
  assert.ok(names.some((n) => /CJAS/i.test(n)));
  assert.ok(names.some((n) => /Drassanes/i.test(n)));
  assert.ok(names.some((n) => /Pere Virgili/i.test(n)));
  assert.equal(isCivicOrCulturalName('Centro Cívic Pati Llimona'), true);
  assert.equal(isCivicOrCulturalName('BCN Checkpoint'), false);
});

await test('Caracas prioriza ONG comunitarias, no maternidades ni clínicas privadas', () => {
  const caracas = WILL_HEALTH_SITES.filter((s) => s.city === 'Caracas').map((s) => s.name);
  assert.ok(caracas.some((n) => /Acción Solidaria/i.test(n)));
  assert.ok(caracas.some((n) => /ACCSI/i.test(n)));
  assert.ok(caracas.some((n) => /StopVIH/i.test(n)));
  assert.equal(caracas.some((n) => /Concepción Palacios/i.test(n)), false);
  assert.equal(isMaternityName('Maternidad Concepción Palacios'), true);
  assert.equal(isPrivateCare({ fee: 'yes' }, 'Clínica Caracas'), true);
  assert.equal(isWillThemeName('Acción Solidaria'), true);
  const geo = readFileSync(join(root, 'api/geo.ts'), 'utf8');
  assert.match(geo, /office"="ngo"/);
});

await test('Preguntar a Will no desmonta la conversación', () => {
  const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');
  assert.match(app, /activeTab === 'chat' \? 'flex flex-col flex-1 min-h-0' : 'hidden'/);
  assert.equal(app.includes("{activeTab === 'chat' && ("), false);
});

if (failed) {
  console.error(`ROJO Otros recursos: ${failed}`);
  process.exit(1);
}
console.log('VERDE Otros recursos (código). La conversación geográfica real se prueba en dispositivo.');
