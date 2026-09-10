export type WorldNode = {
  id: string;
  label: string;
  query: string;
  x: number;
  y: number;
};

/**
 * Porcentajes sobre world-map-screen.jpg (1200×556), no sobre el recorte del
 * contenedor. Cada punto es la ciudad que hay en esa tierra, no el centro
 * de un continente.
 */
export const WORLD_NODES: WorldNode[] = [
  { id: 'lax', label: 'Los Ángeles', query: 'Los Ángeles', x: 16.4, y: 45.2 },
  { id: 'nyc', label: 'Nueva York', query: 'Nueva York', x: 27.8, y: 40.8 },
  { id: 'mex', label: 'Ciudad de México', query: 'Ciudad de México', x: 19.6, y: 52.8 },
  { id: 'bog', label: 'Bogotá', query: 'Bogotá', x: 26.0, y: 61.5 },
  { id: 'sao', label: 'São Paulo', query: 'São Paulo', x: 32.6, y: 73.8 },
  { id: 'bue', label: 'Buenos Aires', query: 'Buenos Aires', x: 30.6, y: 84.0 },
  { id: 'lon', label: 'Londres', query: 'Londres', x: 45.8, y: 31.4 },
  { id: 'bcn', label: 'Barcelona', query: 'Barcelona', x: 47.5, y: 36.4 },
  { id: 'ist', label: 'Estambul', query: 'Estambul', x: 54.3, y: 35.8 },
  { id: 'cai', label: 'El Cairo', query: 'El Cairo', x: 54.0, y: 44.0 },
  { id: 'nbo', label: 'Nairobi', query: 'Nairobi', x: 55.4, y: 59.2 },
  { id: 'cpt', label: 'Ciudad del Cabo', query: 'Ciudad del Cabo', x: 51.6, y: 81.2 },
  { id: 'dxb', label: 'Dubái', query: 'Dubái', x: 60.8, y: 46.8 },
  { id: 'bom', label: 'Mumbai', query: 'Mumbai', x: 72.4, y: 50.6 },
  { id: 'bkk', label: 'Bangkok', query: 'Bangkok', x: 76.2, y: 54.2 },
  { id: 'pek', label: 'Pekín', query: 'Pekín', x: 77.4, y: 37.2 },
  { id: 'tyo', label: 'Tokio', query: 'Tokio', x: 83.6, y: 39.8 },
  { id: 'syd', label: 'Sídney', query: 'Sídney', x: 86.4, y: 77.6 },
  { id: 'akl', label: 'Auckland', query: 'Auckland', x: 91.2, y: 83.0 },
];
