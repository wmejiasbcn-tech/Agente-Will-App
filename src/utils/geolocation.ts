import { emergencyForCountry, EmergencyInfo } from '../data/emergencyNumbers';
import { LanguageFilterMode } from '../data/spokenLanguages';

export type GeoStatus = 'idle' | 'asking' | 'ready' | 'denied' | 'unavailable';

export interface NearbySite {
  name: string;
  kind: string;
  km: number;
  mapsUrl: string;
  languages: string[];
  lat: number;
  lng: number;
}

export interface GeoLookupResult {
  label: string;
  countryCode: string;
  countryName: string;
  emergency: EmergencyInfo;
  sites: NearbySite[];
  languages: string[];
  languageMode: LanguageFilterMode;
  center: { lat: number; lng: number };
  mapEmbedUrl: string;
}

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function requestUserCoords(): Promise<
  | { ok: true; lat: number; lng: number }
  | { ok: false; status: 'denied' | 'unavailable' }
> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.resolve({ ok: false, status: 'unavailable' });
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          ok: true,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          resolve({ ok: false, status: 'denied' });
        } else {
          resolve({ ok: false, status: 'unavailable' });
        }
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 },
    );
  });
}

export async function lookupPlace(body: {
  lat?: number;
  lng?: number;
  q?: string;
  languages?: string[];
  languageMode?: LanguageFilterMode;
}): Promise<GeoLookupResult> {
  const r = await fetch('/api/geo/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || 'No se ha podido leer el lugar.');
  }
  return r.json();
}

export function emergencyFallback(code?: string) {
  return emergencyForCountry(code);
}

export function osmEmbedUrl(center: { lat: number; lng: number }, sites: { lat: number; lng: number }[]) {
  const pts = [center, ...sites];
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const pad = 0.02;
  const minLng = Math.min(...lngs) - pad;
  const minLat = Math.min(...lats) - pad;
  const maxLng = Math.max(...lngs) + pad;
  const maxLat = Math.max(...lats) + pad;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
}
