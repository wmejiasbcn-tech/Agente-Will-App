import type { ResourceCategory } from './spokenLanguages';

export type CuratedHealthSite = {
  name: string;
  kind: string;
  category: ResourceCategory;
  lat: number;
  lng: number;
  address?: string;
  website?: string;
  city: string;
  audience?: string;
};

/** Centros del ámbito de Will. Se suman al mapa abierto cuando el lugar buscado cae cerca. */
export const WILL_HEALTH_SITES: CuratedHealthSite[] = [
  {
    name: 'BCN Checkpoint',
    kind: 'Salud sexual comunitaria',
    category: 'community',
    lat: 41.3789,
    lng: 2.1625,
    address: 'Carrer de Comte Borrell, 164-166, Barcelona',
    website: 'https://www.bcncheckpoint.com',
    city: 'Barcelona',
    audience: 'Atención específica a hombres que tienen sexo con hombres y mujeres trans.',
  },
  {
    name: 'Stop',
    kind: 'Salud sexual y apoyo comunitario',
    category: 'community',
    lat: 41.3816,
    lng: 2.1708,
    address: 'Barcelona',
    website: 'https://stop.org.es',
    city: 'Barcelona',
    audience: 'Atención específica a hombres gais, bisexuales y otros HSH.',
  },
  {
    name: 'CJAS — Centre Jove d’Atenció a les Sexualitats',
    kind: 'Salud sexual',
    category: 'health',
    lat: 41.3729,
    lng: 2.1658,
    address: 'Carrer de Vitòria, 7, Barcelona',
    website: 'https://www.cjas.org',
    city: 'Barcelona',
    audience: 'Atención específica a jóvenes.',
  },
  {
    name: 'Unitat d’ITS Drassanes',
    kind: 'Centro sanitario / ITS',
    category: 'health',
    lat: 41.3757,
    lng: 2.1754,
    address: 'Avinguda de les Drassanes, 17-21, Barcelona',
    city: 'Barcelona',
    audience: 'Atención a población general. Salud sexual e ITS.',
  },
  {
    name: 'Parc Sanitari Pere Virgili',
    kind: 'Centro sociosanitario',
    category: 'health',
    lat: 41.4186,
    lng: 2.1418,
    address: 'Carrer d’Esteve Terradas, 30, Barcelona',
    website: 'https://www.perevirgili.cat',
    city: 'Barcelona',
    audience: 'Atención a población general. Centro sociosanitario.',
  },
  {
    name: 'Energy Control (ABD)',
    kind: 'Reducción de riesgos y daños',
    category: 'community',
    lat: 41.4032,
    lng: 2.1618,
    address: 'Barcelona',
    website: 'https://energycontrol.org',
    city: 'Barcelona',
    audience: 'Atención a población general. Análisis de sustancias y reducción de daños.',
  },
  {
    name: 'Hospital Clínic de Barcelona',
    kind: 'Urgencias / Hospital',
    category: 'emergency',
    lat: 41.3888,
    lng: 2.1519,
    address: 'Carrer de Villarroel, 170, Barcelona',
    city: 'Barcelona',
    audience: 'Atención a población general.',
  },
  {
    name: 'Centro Sanitario Sandoval',
    kind: 'Centro sanitario / ITS',
    category: 'health',
    lat: 40.4305,
    lng: -3.7034,
    address: 'Calle de Sandoval, 7, Madrid',
    city: 'Madrid',
    audience: 'Atención a población general. Unidad de ITS.',
  },
  {
    name: 'Checkpoint Madrid',
    kind: 'Salud sexual comunitaria',
    category: 'community',
    lat: 40.4215,
    lng: -3.6998,
    address: 'Madrid',
    website: 'https://checkpointmadrid.org',
    city: 'Madrid',
    audience: 'Atención específica a hombres que tienen sexo con hombres y mujeres trans.',
  },
  {
    name: 'Acción Solidaria',
    kind: 'ONG / VIH y apoyo comunitario',
    category: 'community',
    lat: 10.4965,
    lng: -66.8515,
    address: 'Avenida Francisco de Miranda, Chacao, Caracas',
    website: 'https://accionsolidaria.info',
    city: 'Caracas',
    audience: 'Atención a población general. VIH y apoyo comunitario.',
  },
  {
    name: 'ACCSI — Acción Ciudadana Contra el SIDA',
    kind: 'ONG / VIH',
    category: 'community',
    lat: 10.4982,
    lng: -66.849,
    address: 'Altamira, Caracas',
    city: 'Caracas',
    audience: 'Atención a población general. VIH.',
  },
  {
    name: 'StopVIH',
    kind: 'ONG / VIH y salud sexual',
    category: 'community',
    lat: 10.492,
    lng: -66.879,
    address: 'Caracas',
    website: 'https://stopvih.org',
    city: 'Caracas',
    audience: 'Atención a población general. VIH y salud sexual.',
  },
  {
    name: 'Red Venezolana de Gente Positiva',
    kind: 'ONG / apoyo entre iguales',
    category: 'community',
    lat: 10.5,
    lng: -66.87,
    address: 'Caracas',
    city: 'Caracas',
    audience: 'Atención a población general. Apoyo entre iguales en VIH.',
  },
  {
    name: 'Venezuela Diversa',
    kind: 'ONG / LGBTIQ+ y salud',
    category: 'community',
    lat: 10.488,
    lng: -66.879,
    address: 'Caracas',
    city: 'Caracas',
    audience: 'Atención específica a personas LGBTIQ+.',
  },
  {
    name: 'Hospital Vargas de Caracas',
    kind: 'Hospital público',
    category: 'emergency',
    lat: 10.5055,
    lng: -66.9172,
    address: 'San José, Caracas',
    city: 'Caracas',
    audience: 'Atención a población general. Hospital público.',
  },
];

const CIVIC =
  /cívic[oa]?|\bcivic\b|casal\b|ateneu|biblioteca|centro cultural|cultural centre|casa de cultura|maison de la culture|teatro|\btheatre\b|\bcine\b|polideportiv|sport centre|arts centre|centro de barrio/i;

const THEME =
  /checkpoint|cjas|drassanes|sandoval|stop sida|energy control|salud sexual|sexual health|saúde sexual|santé sexuelle|\bits\b|\bvih\b|\bhiv\b|\bsida\b|\baids\b|\bprep\b|chemsex|reducción de dañ|reduccion de dan|harm reduction|pere virgili|infectolog|drogodepend|\bcas\b|jeringuill|needle exchange|salud mental|mental health|addiction|lgbt|lgtbi|lgtb|diversidad sexual|acción solidaria|accsi|stopvih|gente positiva|venezuela diversa|reflejos de venezuela|aliansa|trabajadoras sexuales|sex worker|derechos sexuales|salud comunitaria|cruz roja|médicos del mundo|doctors of the world|onusida|unaids/i;

export function isCivicOrCulturalName(name: string) {
  return CIVIC.test(name);
}

export function isWillThemeName(name: string) {
  return THEME.test(name);
}

export function isMaternityName(name: string) {
  return /maternidad|maternity|materno.?infantil|gineco.?obstetr|obstetric/i.test(name);
}

export function isPrivateCare(tags: Record<string, string> | undefined, name: string) {
  const op = (tags?.['operator:type'] || tags?.operator || '').toLowerCase();
  if (tags?.fee === 'yes') return true;
  if (op === 'private' || /\bprivate\b/.test(op)) return true;
  return /clínica caracas|teknon|quirónsalud|quiron|centro médico de caracas|policínica metropolitana/i.test(name);
}
