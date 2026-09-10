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
  },
  {
    name: 'Unitat d’ITS Drassanes',
    kind: 'Centro sanitario / ITS',
    category: 'health',
    lat: 41.3757,
    lng: 2.1754,
    address: 'Avinguda de les Drassanes, 17-21, Barcelona',
    city: 'Barcelona',
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
  },
  {
    name: 'Hospital Clínic de Barcelona',
    kind: 'Urgencias / Hospital',
    category: 'emergency',
    lat: 41.3888,
    lng: 2.1519,
    address: 'Carrer de Villarroel, 170, Barcelona',
    city: 'Barcelona',
  },
  {
    name: 'Centro Sanitario Sandoval',
    kind: 'Centro sanitario / ITS',
    category: 'health',
    lat: 40.4305,
    lng: -3.7034,
    address: 'Calle de Sandoval, 7, Madrid',
    city: 'Madrid',
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
  },
];

const CIVIC =
  /cívic[oa]?|\bcivic\b|casal\b|ateneu|biblioteca|centro cultural|cultural centre|casa de cultura|maison de la culture|teatro|\btheatre\b|\bcine\b|polideportiv|sport centre|arts centre|centro de barrio/i;

const THEME =
  /checkpoint|cjas|drassanes|sandoval|stop sida|energy control|salud sexual|sexual health|saúde sexual|santé sexuelle|\bits\b|\bvih\b|\bhiv\b|\bsida\b|\baids\b|\bprep\b|chemsex|reducción de dañ|reduccion de dan|harm reduction|pere virgili|infectolog|drogodepend|\bcas\b|jeringuill|needle exchange|salud mental|mental health|addiction/i;

export function isCivicOrCulturalName(name: string) {
  return CIVIC.test(name);
}

export function isWillThemeName(name: string) {
  return THEME.test(name);
}
