export type GeoStatus = 'idle' | 'asking' | 'ready' | 'denied' | 'unavailable';

export type KnownCityId = 'barcelona' | 'madrid';

export interface KnownCity {
  id: KnownCityId;
  label: string;
  lat: number;
  lng: number;
}

export const KNOWN_CITIES: KnownCity[] = [
  { id: 'barcelona', label: 'Barcelona', lat: 41.3874, lng: 2.1686 },
  { id: 'madrid', label: 'Madrid', lat: 40.4168, lng: -3.7038 },
];

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function nearestCity(lat: number, lng: number): KnownCity | null {
  let best: KnownCity | null = null;
  let bestKm = Infinity;
  for (const city of KNOWN_CITIES) {
    const km = distanceKm({ lat, lng }, city);
    if (km < bestKm) {
      bestKm = km;
      best = city;
    }
  }
  if (!best || bestKm > 80) return null;
  return best;
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
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 },
    );
  });
}
