export type WorldNode = {
  id: string;
  label: string;
  query: string;
  x: number;
  y: number;
};

/** Puntos de entrada visuales. No son el catálogo del planeta. */
export const WORLD_NODES: WorldNode[] = [
  { id: 'na', label: 'América del Norte', query: 'Nueva York', x: 22, y: 38 },
  { id: 'mx', label: 'México y Centroamérica', query: 'Ciudad de México', x: 20, y: 48 },
  { id: 'sa', label: 'América del Sur', query: 'Buenos Aires', x: 28, y: 70 },
  { id: 'eu', label: 'Europa', query: 'Barcelona', x: 48.5, y: 34 },
  { id: 'af', label: 'África', query: 'Nairobi', x: 52, y: 55 },
  { id: 'tr', label: 'Mediterráneo oriental', query: 'Estambul', x: 55, y: 38 },
  { id: 'in', label: 'Asia meridional', query: 'Mumbai', x: 66, y: 48 },
  { id: 'ea', label: 'Asia oriental', query: 'Tokio', x: 82, y: 40 },
  { id: 'sea', label: 'Sudeste asiático', query: 'Bangkok', x: 76, y: 52 },
  { id: 'oc', label: 'Oceanía', query: 'Wellington', x: 88, y: 72 },
];
