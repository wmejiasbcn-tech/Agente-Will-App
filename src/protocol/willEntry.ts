/**
 * Protocolo transversal de entradas de Will.
 * NO ELEGIR POR LA PERSONA LO QUE LA PERSONA TODAVÍA NO HA ELEGIDO.
 *
 * A — conversación abierta
 * B — exploración de información
 * C — catálogo / repositorio
 * D — contenido elegido explícitamente (nunca es el estado inicial)
 */

export type EntryPattern = 'A' | 'B' | 'C' | 'D';

export type WillEntryDef = {
  id: string;
  section: string;
  level: 1 | 2;
  pattern: EntryPattern;
  invitation: string;
  fallbackAskWill: string;
  /** Si true, entrar aquí no puede mostrar una ficha/documento/recurso concreto. */
  forbidsPresetContent: boolean;
};

export const ASK_WILL_FALLBACK =
  '¿No encuentras lo que buscas? Escríbelo o díselo a Will.';

export const WILL_ENTRIES: WillEntryDef[] = [
  {
    id: 'chat',
    section: 'Hablar con Will',
    level: 1,
    pattern: 'A',
    invitation: '¿Sobre qué te gustaría hablar?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'acompanamiento',
    section: 'Hablar de lo que me pasa',
    level: 2,
    pattern: 'A',
    invitation: '¿Sobre qué te gustaría hablar?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'libre',
    section: '¿No sabes dónde encaja?',
    level: 2,
    pattern: 'A',
    invitation: 'Cuéntame lo que quieras, sin tener que clasificarlo.',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'topics',
    section: 'Explorar Temas',
    level: 1,
    pattern: 'B',
    invitation: '¿Qué te gustaría explorar?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'salud-sexual',
    section: 'Salud sexual',
    level: 2,
    pattern: 'B',
    invitation: '¿Qué te gustaría explorar sobre salud sexual?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'placer-sexual',
    section: 'Placer, deseo y relaciones',
    level: 2,
    pattern: 'B',
    invitation: '¿Qué te gustaría explorar sobre placer, deseo y relaciones?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'consumo-psicotropicas',
    section: 'Sustancias',
    level: 2,
    pattern: 'B',
    invitation: '¿Qué te gustaría explorar sobre sustancias?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'chemsex',
    section: 'Chemsex',
    level: 2,
    pattern: 'B',
    invitation: '¿Qué te gustaría explorar sobre Chemsex?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'slam',
    section: 'SLAM',
    level: 2,
    pattern: 'B',
    invitation: '¿Qué te gustaría explorar sobre SLAM?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'prevencion',
    section: 'Prevención',
    level: 2,
    pattern: 'B',
    invitation: '¿Qué te gustaría conocer sobre prevención?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'resources',
    section: 'Recursos de Apoyo',
    level: 1,
    pattern: 'C',
    invitation: '¿Qué tipo de recurso quieres consultar?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'other-resources',
    section: 'Otros recursos',
    level: 1,
    pattern: 'B',
    invitation: '¿Dónde quieres buscar recursos?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
  {
    id: 'how-it-works',
    section: 'Cómo funciona Will',
    level: 1,
    pattern: 'C',
    invitation: '¿Qué te gustaría conocer sobre cómo funciona Will?',
    fallbackAskWill: ASK_WILL_FALLBACK,
    forbidsPresetContent: true,
  },
];

export const EXPLORATION_DOMAIN_IDS = [
  'salud-sexual',
  'placer-sexual',
  'consumo-psicotropicas',
  'chemsex',
  'slam',
  'prevencion',
] as const;

export const CONVERSATION_DOOR_IDS = ['acompanamiento', 'libre'] as const;

export function entryFor(id: string): WillEntryDef | undefined {
  return WILL_ENTRIES.find((e) => e.id === id);
}

export function isExplorationDomain(id: string) {
  return (EXPLORATION_DOMAIN_IDS as readonly string[]).includes(id);
}

export function isConversationDoor(id: string) {
  return (CONVERSATION_DOOR_IDS as readonly string[]).includes(id);
}

export function invitationFor(id: string) {
  return entryFor(id)?.invitation || '¿Qué te gustaría explorar?';
}

export function askWillAboutMissing(term: string) {
  const q = term.trim();
  if (!q) return 'Quiero hablar con Will sobre algo que no he encontrado en el catálogo.';
  return `No he encontrado «${q}» en el catálogo y quiero hablarlo con Will.`;
}

/** Invariante: sin selección explícita, selectedContentId debe ser null. */
export function assertNoPresetContent(selectedContentId: string | null | undefined) {
  return selectedContentId == null || selectedContentId === '';
}
