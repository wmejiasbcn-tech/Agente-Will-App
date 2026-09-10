export type WorldNode = {
  id: string;
  label: string;
  query: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
};

/**
 * GCPs: lat/lng reales (Nominatim/WGS84) y % sobre world-map-screen.jpg
 * (1200×556). Leaflet proyecta desde aquí. No son el catálogo del planeta.
 */
export const WORLD_NODES: WorldNode[] = [
  { id: 'lax', label: 'Los Ángeles', query: 'Los Ángeles', lat: 34.0537, lng: -118.2428, x: 16.4, y: 45.2 },
  { id: 'nyc', label: 'Nueva York', query: 'Nueva York', lat: 40.7128, lng: -74.006, x: 27.8, y: 40.8 },
  { id: 'mex', label: 'Ciudad de México', query: 'Ciudad de México', lat: 19.4326, lng: -99.1332, x: 19.6, y: 52.8 },
  { id: 'bog', label: 'Bogotá', query: 'Bogotá', lat: 4.711, lng: -74.0721, x: 26.0, y: 61.5 },
  { id: 'sao', label: 'São Paulo', query: 'São Paulo', lat: -23.5505, lng: -46.6333, x: 32.6, y: 73.8 },
  { id: 'bue', label: 'Buenos Aires', query: 'Buenos Aires', lat: -34.6037, lng: -58.3816, x: 30.6, y: 84.0 },
  { id: 'lon', label: 'Londres', query: 'Londres', lat: 51.5074, lng: -0.1278, x: 45.8, y: 31.4 },
  { id: 'bcn', label: 'Barcelona', query: 'Barcelona', lat: 41.3874, lng: 2.1686, x: 47.5, y: 36.4 },
  { id: 'ist', label: 'Estambul', query: 'Estambul', lat: 41.0082, lng: 28.9784, x: 54.3, y: 35.8 },
  { id: 'cai', label: 'El Cairo', query: 'El Cairo', lat: 30.0444, lng: 31.2357, x: 54.0, y: 44.0 },
  { id: 'nbo', label: 'Nairobi', query: 'Nairobi', lat: -1.2921, lng: 36.8219, x: 55.4, y: 59.2 },
  { id: 'cpt', label: 'Ciudad del Cabo', query: 'Ciudad del Cabo', lat: -33.9249, lng: 18.4241, x: 51.6, y: 81.2 },
  { id: 'dxb', label: 'Dubái', query: 'Dubái', lat: 25.2048, lng: 55.2708, x: 60.8, y: 46.8 },
  { id: 'bom', label: 'Mumbai', query: 'Mumbai', lat: 19.076, lng: 72.8777, x: 72.4, y: 50.6 },
  { id: 'bkk', label: 'Bangkok', query: 'Bangkok', lat: 13.7563, lng: 100.5018, x: 76.2, y: 54.2 },
  { id: 'pek', label: 'Pekín', query: 'Pekín', lat: 39.9042, lng: 116.4074, x: 77.4, y: 37.2 },
  { id: 'tyo', label: 'Tokio', query: 'Tokio', lat: 35.6762, lng: 139.6503, x: 83.6, y: 39.8 },
  { id: 'syd', label: 'Sídney', query: 'Sídney', lat: -33.8688, lng: 151.2093, x: 86.4, y: 77.6 },
  { id: 'akl', label: 'Auckland', query: 'Auckland', lat: -36.8509, lng: 174.7645, x: 91.2, y: 83.0 },
];

export const MAP_IMAGE = {
  src: '/visual-system/world-map-screen.jpg',
  width: 1200,
  height: 556,
};
