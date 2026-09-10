import assert from 'node:assert/strict';
import { emergencyForCountry } from '../src/data/emergencyNumbers';
import { distanceKm } from '../src/utils/geolocation';
import {
  isGeoStorageKey,
  looksLikeCoordinates,
  readGeoLeaksFromStorage,
} from '../src/utils/geoPrivacy';

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

if (failed) {
  console.error(`\n${failed} pruebas fallidas`);
  process.exit(1);
}
console.log('\nPruebas de geolocalización y privacidad: verde.');
