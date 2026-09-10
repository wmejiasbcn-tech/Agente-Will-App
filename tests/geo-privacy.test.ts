import assert from 'node:assert/strict';
import { emergencyForCountry } from '../src/data/emergencyNumbers';
import { distanceKm } from '../src/utils/geolocation';
import {
  isGeoStorageKey,
  looksLikeCoordinates,
  readGeoLeaksFromStorage,
} from '../src/utils/geoPrivacy';
import {
  extractLanguageLayers,
  sortByCareLanguages,
  sortByLanguages,
  languagesFromOsmTags,
} from '../src/data/spokenLanguages';

function mockStorage(entries: Record<string, string>) {
  const keys = Object.keys(entries);
  return {
    length: keys.length,
    key: (i: number) => keys[i] ?? null,
    getItem: (k: string) => (k in entries ? entries[k] : null),
  };
}

const TOKYO = { lat: 35.6762, lng: 139.6503 };
const BARCELONA = { lat: 41.3874, lng: 2.1686 };
const USHUAIA = { lat: -54.8019, lng: -68.303 };
const ANCHORAGE = { lat: 61.2181, lng: -149.9003 };
const CAPE_TOWN = { lat: -33.9249, lng: 18.4241 };
const WELLINGTON = { lat: -41.2865, lng: 174.7762 };

let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

test('Tokio no es Barcelona', () => {
  const km = distanceKm(TOKYO, BARCELONA);
  assert.ok(km > 8000, `esperado >8000, fue ${km}`);
});

test('el mundo cabe: Alaska, Patagonia, África, Oceanía', () => {
  assert.ok(distanceKm(ANCHORAGE, USHUAIA) > 10000);
  assert.ok(distanceKm(CAPE_TOWN, WELLINGTON) > 10000);
  assert.ok(distanceKm(TOKYO, WELLINGTON) > 8000);
});

test('emergencias por país', () => {
  assert.deepEqual(emergencyForCountry('JP').numbers, ['119', '110']);
  assert.deepEqual(emergencyForCountry('US').numbers, ['911']);
  assert.deepEqual(emergencyForCountry('AR').numbers, ['911', '107']);
  assert.deepEqual(emergencyForCountry('NZ').numbers, ['111']);
  assert.deepEqual(emergencyForCountry('ZA').numbers, ['10177', '112']);
  assert.ok(emergencyForCountry('ES').numbers.includes('112'));
});

test('privacidad: claves de almacenamiento geográfico', () => {
  assert.equal(isGeoStorageKey('will_lat'), true);
  assert.equal(isGeoStorageKey('latitude'), true);
  assert.equal(isGeoStorageKey('theme'), false);
  assert.equal(looksLikeCoordinates('{"lat":41.387,"lng":2.168}'), true);
  assert.equal(looksLikeCoordinates('Hola Will'), false);
});

test('privacidad: no hay fugas en un storage limpio', () => {
  const leaks = readGeoLeaksFromStorage(mockStorage({ theme: 'dark', lang: 'es' }));
  assert.deepEqual(leaks, []);
});

test('privacidad: detecta coordenadas guardadas', () => {
  const leaks = readGeoLeaksFromStorage(
    mockStorage({ user: '{"lat":35.676,"lng":139.650}' }),
  );
  assert.ok(leaks.includes('user'));
});

test('idioma: el nombre en inglés no es atención en inglés', () => {
  const layers = extractLanguageLayers({
    name: '聖路加国際病院',
    'name:en': 'St. Luke International Hospital',
    'name:ja': '聖路加国際病院',
  });
  assert.ok(layers.nameLanguages.includes('en'));
  assert.equal(layers.careLanguages.includes('en'), false);
});

test('idioma: international sí es indicio de atención en inglés', () => {
  const layers = extractLanguageLayers({
    name: 'St. Luke\'s International Hospital',
  });
  assert.ok(layers.careLanguages.includes('en'));
});

test('idioma: language:en sí es atención', () => {
  const layers = extractLanguageLayers({
    name: 'Clinic',
    'language:en': 'yes',
    languages: 'en;ja',
  });
  assert.ok(layers.careLanguages.includes('en'));
  assert.ok(layers.careLanguages.includes('ja'));
});

test('filtros: priorizar y solo usan atención, no el nombre', () => {
  const sites = [
    { name: 'A', careLanguages: ['ja'], km: 1 },
    { name: 'B', careLanguages: ['en', 'ja'], km: 3 },
    { name: 'C', careLanguages: [], km: 2 },
  ];
  const prior = sortByCareLanguages(sites, ['en'], 'prioritize');
  assert.equal(prior[0].name, 'B');
  const only = sortByCareLanguages(sites, ['en'], 'only');
  assert.deepEqual(
    only.map((s) => s.name),
    ['B'],
  );
});

test('filtros de idioma legado: priorizar y solo', () => {
  const sites = [
    { name: 'A', languages: ['ja'], km: 1 },
    { name: 'B', languages: ['en', 'ja'], km: 3 },
    { name: 'C', languages: ['es'], km: 2 },
  ];
  const prior = sortByLanguages(sites, ['en'], 'prioritize');
  assert.equal(prior[0].name, 'B');
  const only = sortByLanguages(sites, ['en'], 'only');
  assert.deepEqual(
    only.map((s) => s.name),
    ['B'],
  );
  const langs = languagesFromOsmTags({
    name: 'St Luke',
    'name:en': 'St. Luke',
    'name:ja': '聖路加',
  });
  assert.ok(langs.includes('en') && langs.includes('ja'));
});

if (failed) {
  console.error(`\n${failed} pruebas fallidas`);
  process.exit(1);
}
console.log('\nPruebas de geolocalización, idiomas y privacidad: verde.');
