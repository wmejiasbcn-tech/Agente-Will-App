import { WORLD_NODES, MAP_IMAGE } from '../data/worldNodes';
import { lonLatToMercator, mercatorToLonLat } from './webMercator';

export type ImagePct = { x: number; y: number };

const POWER = 2.4;

function idw(weights: number[], values: number[]) {
  const sumW = weights.reduce((a, b) => a + b, 0);
  if (sumW === 0) return values[0];
  return values.reduce((acc, v, i) => acc + v * weights[i], 0) / sumW;
}

/** WGS84 → % sobre el mapamundi de Will (no equirectangular). */
export function wgsToImage(lat: number, lng: number): ImagePct {
  const m = lonLatToMercator({ lat, lng });
  const dist: number[] = [];
  for (const n of WORLD_NODES) {
    const g = lonLatToMercator({ lat: n.lat, lng: n.lng });
    const dx = m.x - g.x;
    const dy = m.y - g.y;
    dist.push(Math.hypot(dx, dy));
  }
  const nearest = Math.min(...dist);
  if (nearest < 1) {
    const n = WORLD_NODES[dist.indexOf(nearest)];
    return { x: n.x, y: n.y };
  }
  const w = dist.map((d) => 1 / d ** POWER);
  return {
    x: idw(w, WORLD_NODES.map((n) => n.x)),
    y: idw(w, WORLD_NODES.map((n) => n.y)),
  };
}

/** % imagen → WGS84 aproximado (clic en el mapamundi). */
export function imageToWgs(x: number, y: number): { lat: number; lng: number } {
  const dist = WORLD_NODES.map((n) => Math.hypot(x - n.x, y - n.y));
  const nearest = Math.min(...dist);
  if (nearest < 0.4) {
    const n = WORLD_NODES[dist.indexOf(nearest)];
    return { lat: n.lat, lng: n.lng };
  }
  const w = dist.map((d) => 1 / Math.max(d, 0.05) ** POWER);
  const mercs = WORLD_NODES.map((n) => lonLatToMercator({ lat: n.lat, lng: n.lng }));
  const mx = idw(w, mercs.map((m) => m.x));
  const my = idw(w, mercs.map((m) => m.y));
  return mercatorToLonLat({ x: mx, y: my });
}

/** CSS % (arriba-izquierda) → Leaflet CRS.Simple (y crece al norte). */
export function imagePctToLeaflet(pct: ImagePct): [number, number] {
  return [
    ((100 - pct.y) / 100) * MAP_IMAGE.height,
    (pct.x / 100) * MAP_IMAGE.width,
  ];
}

export function leafletToImagePct(yPx: number, xPx: number): ImagePct {
  return {
    x: (xPx / MAP_IMAGE.width) * 100,
    y: 100 - (yPx / MAP_IMAGE.height) * 100,
  };
}

export function leafletBounds(): [[number, number], [number, number]] {
  return [
    [0, 0],
    [MAP_IMAGE.height, MAP_IMAGE.width],
  ];
}
