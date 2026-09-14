import type { ContextCategory } from '../types';
import { isVetoedResource, isVetoedUrl } from '../utils/resourceVeto';

export type VerifiedConversationResource = {
  name: string;
  kind: string;
  url: string;
  domains: ContextCategory[];
};

/** Solo URLs ya presentes en el directorio curado de Will. No se inventan. */
const CATALOG: VerifiedConversationResource[] = [
  {
    name: 'BCN Checkpoint',
    kind: 'Salud sexual comunitaria',
    url: 'https://www.bcncheckpoint.com',
    domains: ['salud-sexual', 'placer-sexual', 'prevencion', 'chemsex'],
  },
  {
    name: 'Stop',
    kind: 'Salud sexual y apoyo comunitario',
    url: 'https://stop.org.es',
    domains: ['salud-sexual', 'prevencion', 'chemsex'],
  },
  {
    name: 'CJAS — Centre Jove d’Atenció a les Sexualitats',
    kind: 'Salud sexual',
    url: 'https://www.cjas.org',
    domains: ['salud-sexual', 'placer-sexual', 'prevencion'],
  },
  {
    name: 'Energy Control (ABD)',
    kind: 'Reducción de riesgos y daños',
    url: 'https://energycontrol.org',
    domains: ['consumo-psicotropicas', 'chemsex', 'slam', 'prevencion'],
  },
  {
    name: 'Checkpoint Madrid',
    kind: 'Salud sexual comunitaria',
    url: 'https://checkpointmadrid.org',
    domains: ['salud-sexual', 'prevencion', 'chemsex'],
  },
  {
    name: 'Acción Solidaria',
    kind: 'ONG / VIH y apoyo comunitario',
    url: 'https://accionsolidaria.info',
    domains: ['salud-sexual', 'prevencion'],
  },
  {
    name: 'StopVIH',
    kind: 'ONG / VIH y salud sexual',
    url: 'https://stopvih.org',
    domains: ['salud-sexual', 'prevencion'],
  },
  {
    name: 'Parc Sanitari Pere Virgili',
    kind: 'Centro sociosanitario',
    url: 'https://www.perevirgili.cat',
    domains: ['salud-sexual', 'prevencion'],
  },
];

export const VERIFIED_CONVERSATION_RESOURCES: VerifiedConversationResource[] =
  CATALOG.filter((item) => !isVetoedResource(item.name, item.url));

export const RESOURCE_CONTEXTS: ContextCategory[] = [
  'salud-sexual',
  'placer-sexual',
  'consumo-psicotropicas',
  'chemsex',
  'slam',
  'prevencion',
];

const PRIMARY_BY_CONTEXT: Partial<Record<ContextCategory, string>> = {
  slam: 'https://energycontrol.org',
  chemsex: 'https://energycontrol.org',
  'consumo-psicotropicas': 'https://energycontrol.org',
  'salud-sexual': 'https://www.bcncheckpoint.com',
  'placer-sexual': 'https://www.cjas.org',
  prevencion: 'https://www.bcncheckpoint.com',
};

const VERIFIED_URLS = new Set(
  VERIFIED_CONVERSATION_RESOURCES.map((item) => normalizeUrl(item.url)),
);

export function offersConversationResources(type?: ContextCategory): boolean {
  return Boolean(type && RESOURCE_CONTEXTS.includes(type));
}

export function primaryResourceFor(
  type?: ContextCategory,
): VerifiedConversationResource | null {
  if (!offersConversationResources(type) || !type) return null;
  const preferred = PRIMARY_BY_CONTEXT[type];
  const match =
    VERIFIED_CONVERSATION_RESOURCES.find((item) => item.url === preferred) ||
    VERIFIED_CONVERSATION_RESOURCES.find((item) => item.domains.includes(type));
  if (!match || isVetoedResource(match.name, match.url)) return null;
  return match;
}

export function isVerifiedResourceUrl(url: string): boolean {
  if (!url || isVetoedUrl(url)) return false;
  return VERIFIED_URLS.has(normalizeUrl(url));
}

export function labelForVerifiedUrl(url: string): string | null {
  const found = VERIFIED_CONVERSATION_RESOURCES.find(
    (item) => normalizeUrl(item.url) === normalizeUrl(url),
  );
  return found?.name || null;
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, '');
    return `${parsed.protocol}//${parsed.host.toLowerCase()}${path}`.toLowerCase();
  } catch {
    return url.trim().replace(/\/$/, '').toLowerCase();
  }
}
