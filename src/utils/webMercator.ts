/** Web Mercator EPSG:3857. R = 6378137 m. */

const R = 6378137;
const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const MAX_LAT = 85.05112878;

export type LonLat = { lat: number; lng: number };
export type Mercator = { x: number; y: number };

export function lonLatToMercator(p: LonLat): Mercator {
  const lat = Math.max(-MAX_LAT, Math.min(MAX_LAT, p.lat));
  return {
    x: R * p.lng * D2R,
    y: R * Math.log(Math.tan(Math.PI / 4 + (lat * D2R) / 2)),
  };
}

export function mercatorToLonLat(p: Mercator): LonLat {
  return {
    lng: (p.x / R) * R2D,
    lat: (2 * Math.atan(Math.exp(p.y / R)) - Math.PI / 2) * R2D,
  };
}
