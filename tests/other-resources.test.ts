import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORLD_NODES } from '../src/data/worldNodes';

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
  assert.match(view, /world-map-screen\.jpg/);
});

await test('Los puntos del mapa son entradas, no un catálogo cerrado del planeta', () => {
  assert.ok(WORLD_NODES.length >= 8);
  assert.equal(WORLD_NODES.some((n) => n.query === 'Tokio'), true);
  assert.match(view, /other-resources-search/);
  assert.match(view, /Usar mi ubicación/);
});

await test('Accesible sin el mapa: búsqueda, labels y teclado', () => {
  assert.match(view, /htmlFor="other-resources-search"/);
  assert.match(view, /aria-label="Regiones del mapamundi"/);
  assert.match(view, /Buscar ciudad, región, país/);
});

if (failed) {
  console.error(`ROJO Otros recursos: ${failed}`);
  process.exit(1);
}
console.log('VERDE Otros recursos (código). La conversación geográfica real se prueba en dispositivo.');
