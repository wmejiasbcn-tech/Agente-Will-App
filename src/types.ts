export type Role = 'user' | 'assistant';

export type CanonicalDomainId =
  | 'acompanamiento'
  | 'salud-sexual'
  | 'placer-sexual'
  | 'consumo-psicotropicas'
  | 'chemsex'
  | 'slam';

export type ContextCategory =
  | 'acompanamiento'
  | 'salud-sexual'
  | 'placer-sexual'
  | 'consumo-psicotropicas'
  | 'chemsex'
  | 'slam'
  | 'general';

export type EpistemicStatus = 'VERIFICADO' | 'INFERIDO' | 'DESCONOCIDO';

export type ResourceType = 'URGENCIAS' | 'SANITARIO_CLASICO' | 'REDUCCION_RIESGOS_DANOS';

export interface CanonicalResource {
  name: string;
  type: ResourceType;
  typeLabel: string;
  description: string;
  contact?: string;
}

export interface CanonicalDomainDefinition {
  id: CanonicalDomainId;
  number: number;
  title: string;
  shortTitle: string;
  tagline: string;
  aphorismTitle: string;
  aphorismText: string;
  description: string;
  bulletPoints: string[];
  themeColor: string;
  badgeBg: string;
}

export interface DetectedContextInfo {
  type: ContextCategory;
  label: string;
  badgeLabel: string;
  description: string;
  keywordsMatched: string[];
  technicalFocus: string[];
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  dimension?: string;
  detectedContext?: DetectedContextInfo;
  audioPlaying?: boolean;
}

export type PresenteCode = 'P' | 'R' | 'E1' | 'S' | 'E2' | 'N' | 'T' | 'E3';

export interface PresenteDimension {
  code: PresenteCode;
  letter: string;
  name: string;
  tagline: string;
  description: string;
  willStance: string;
  userSovereignty: string;
  sampleExplorations: string[];
}

export interface ConstitutionalArticle {
  number: string;
  title: string;
  subtitle: string;
  fullText: string[];
  keyQuotes: string[];
  architecturalRules: string[];
}

export interface AuditResult {
  isCompliant: boolean;
  directivityScore: number;
  verdictTitle: string;
  analysis: string;
  hiddenDirectives: string[];
  constitutionalArticlesAffected: string[];
  nonDirectiveReformulation: string;
  verificationStatus?: EpistemicStatus;
  sourcesCited?: string[];
}

export interface EcosystemAppendixSection {
  id: string;
  title: string;
  badge: string;
  summary: string;
  items: {
    label: string;
    description: string;
    status: EpistemicStatus;
    detail?: string;
  }[];
}

/**
 * 12-Point Canonical Ficha WAIPL Structure
 * Context -> Risk vs Harm -> Decision -> Harm Reduction -> Resources
 */
export interface SubstanceInfo {
  // 1. Qué es / Identidad
  id: string;
  name: string;
  // 2. Pertenece exactamente a una de las 6 Categorías Principales
  domainId: CanonicalDomainId;
  category:
    | '1. Acompañamiento No Directivo'
    | '2. Autogestión de la Salud Sexual'
    | '3. Autogestión del Placer Sexual'
    | '4. Consumo No Problemático de Psicotrópicas'
    | '5. Reducción de Riesgos y Daños del Chemsex'
    | '6. Reducción de Riesgos y Daños del SLAM';
  summary: string;
  // Arnés Epistemológico
  epistemicStatus?: EpistemicStatus;
  // 3. Vías de administración (si aplica)
  adminRoutes?: string[];
  // 4. Efectos buscados / Vivencia subjetiva
  soughtEffects?: string[];
  // 5. Mecanismo / Farmacología / Fundamentación
  pharmacology: string;
  // 6. Riesgos objetivos (Diferenciación Riesgo vs Daño)
  objectiveRisksAndInteractions: string[];
  // 7. Interacciones críticas
  criticalInteractions?: string[];
  // 8. Reducción de riesgos y daños (No operacional - sin recetas de ejecución)
  harmReductionFacts: string[];
  // 9. Señales de alarma y complicaciones que requieren atención
  warningSigns?: string[];
  // 10. Incertidumbres y variabilidad
  knownUncertainties: string[];
  // 11. Recursos clasificados (Urgencias, Sanitario Clásico, Reducción de Riesgos y Daños)
  categorizedResources?: CanonicalResource[];
  communityResources?: string[];
  // 12. Fuentes verificadas
  sources?: string[];
  keyConsiderations?: string[];
}
