import { ContextCategory, DetectedContextInfo } from '../types';

export interface ContextCategoryConfig {
  type: ContextCategory;
  number: number;
  label: string;
  shortLabel: string;
  badgeLabel: string;
  description: string;
  aphorism: string;
  keywords: string[];
  regexList: RegExp[];
  technicalFocus: string[];
}

export const CANONICAL_CONTEXT_PATTERNS: ContextCategoryConfig[] = [
  // 1. ACOMPAÑAMIENTO NO DIRECTIVO, NO PRESCRIPTIVO Y NO DIAGNÓSTICO
  {
    type: 'acompanamiento',
    number: 1,
    label: '1. Acompañamiento No Directivo, No Prescriptivo y No Diagnóstico',
    shortLabel: '1. Acompañamiento',
    badgeLabel: '1. Acompañamiento No Directivo',
    description:
      'Escucha sin juicio, presencia, acogida, no dirección ni inducción, no diagnóstico, no prescripción. Información neutral, transparencia y respeto irrestricto a la autonomía.',
    aphorism: 'P.R.E.S.E.N.T.E. — Arquitectura no lineal: no es ruta, no es secuencia, no es protocolo.',
    keywords: [
      'presente',
      'acompañamiento',
      'acompanamiento',
      'no directividad',
      'no directivo',
      'no prescriptivo',
      'no diagnóstico',
      'no diagnostico',
      'escucha',
      'soberanía',
      'soberania',
      'waipl',
      'constitución',
      'constitucion',
      'autonomía',
      'autonomia',
      'presencia',
      'acogida',
      'decisión propia',
      'decision propia',
    ],
    regexList: [
      /\b(presente|waipl|constituci[oó]n)\b/i,
      /\b(no\s+directiv\w*|no\s+prescriptiv\w*|no\s+diagn[oó]stic\w*)\b/i,
      /\b(acompa[ñn]amiento|soberan[ií]a\s+decisional)\b/i,
    ],
    technicalFocus: [
      'Escucha activa sin juicio ni inducción de conductas',
      'Marco P.R.E.S.E.N.T.E. no teleológico (no progresivo ni evaluativo)',
      'Información neutral con arnés epistemológico (Verificado / Inferido / Desconocido)',
      'Soberanía innegociable en la persona que consulta',
    ],
  },

  // 2. AUTOGESTIÓN DE LA SALUD SEXUAL
  {
    type: 'salud-sexual',
    number: 2,
    label: '2. Autogestión de la Salud Sexual',
    shortLabel: '2. Salud Sexual',
    badgeLabel: '2. Salud Sexual',
    description:
      'Prácticas sexuales (vaginal, anal, oral, penetrar, ser penetrado), preservativo (uso/no uso), anticoncepción, parejas múltiples, ITS (infección vs enfermedad), VIH/VHC/ITS, PrEP/PEP, probabilidades, cribado y recursos sanitarios.',
    aphorism: 'AUTOGESTIÓN INFORMADA — Decidir con información, no imponer conductas.',
    keywords: [
      'salud sexual',
      'prep',
      'pep',
      'doxypep',
      'doxy-pep',
      'doxiciclina',
      'vih',
      'vhc',
      'hepatitis c',
      'hepatitis b',
      'vhb',
      'hepatitis a',
      'vha',
      'its',
      'ets',
      'infección',
      'infeccion',
      'enfermedad',
      'sífilis',
      'sifilis',
      'gonorrea',
      'clamidia',
      'chlamydia',
      'lgv',
      'linfogranuloma',
      'mycoplasma',
      'vph',
      'mpox',
      'viruela del mono',
      'preservativo',
      'preservativos',
      'condón',
      'condon',
      'anticoncepción',
      'anticoncepcion',
      'cribado',
      'serología',
      'serologia',
      'frotis',
      'exudado',
      'uretra',
      'recto',
      'faringe',
      'chancro',
      'secreción',
      'secrecion',
      'i=i',
      'indetectable',
      'intransmisible',
      'eyaculación',
      'eyaculacion',
      'penetración',
      'penetracion',
      'vaginal',
      'anal',
      'oral',
      'checkpoint',
      'parejas múltiples',
      'parejas multiples',
    ],
    regexList: [
      /\b(salud\s+sexual|pr?ep|pep|doxypep|doxy-pep)\b/i,
      /\b(vih|vhc|vhb|vha|its|ets|s[ií]filis|gonorrea|clamidia|chlamydia|lgv|mycoplasma|vph|mpox)\b/i,
      /\b(preservativ\w*|cond[oó]n|anticoncepci[oó]n|cribado|serolog[ií]a|i=i|indetectable)\b/i,
      /\b(pr[aá]cticas?\s+sexual\w*|penetraci[oó]n|eyaculaci[oó]n)\b/i,
    ],
    technicalFocus: [
      'Diferenciación técnica entre infección (presencia de patógeno) y enfermedad (daño tisular)',
      'Prevención biomédica: PrEP (diaria vs 2-1-1 a demanda) y PEP urgente (24h-72h)',
      'Indetectable = Intransmisible (I=I) en VIH',
      'Cribado periódico multizona asintomático (faringe, uretra/orina, recto, serología)',
      'Probabilidades y riesgos objetivos sin moralina ni imposición de conductas',
    ],
  },

  // 3. AUTOGESTIÓN DEL PLACER SEXUAL
  {
    type: 'placer-sexual',
    number: 3,
    label: '3. Autogestión del Placer Sexual',
    shortLabel: '3. Placer Sexual',
    badgeLabel: '3. Placer Sexual',
    description:
      'Deseo y preferencias, placer individual y compartido, consentimiento dinámico, comunicación y acuerdos, exploración y diversidad, identidad y expresión, intimidad y límites, derecho al placer sin moralización ni juicio.',
    aphorism: 'EL PLACER NO ES PREVENCIÓN — El placer es una dimensión legítima y autónoma.',
    keywords: [
      'placer',
      'deseo',
      'preferencias',
      'placer individual',
      'placer compartido',
      'masturbación',
      'masturbacion',
      'juguetes eróticos',
      'juguetes eroticos',
      'consentimiento dinámico',
      'consentimiento dinamico',
      'consentimiento',
      'comunicación',
      'comunicacion',
      'acuerdos',
      'acuerdos sexuales',
      'exploración',
      'exploracion',
      'diversidad',
      'identidad',
      'expresión de género',
      'expresion de genero',
      'intimidad',
      'límites',
      'limites',
      'derecho al placer',
      'sin moralización',
      'sin moralizacion',
      'sin juicio',
      'bdsm',
      'fisting',
      'kink',
      'roleplay',
      'juego de impacto',
      'safeword',
      'palabra de seguridad',
      'poliamor',
      'no monogamia',
      'no monogamias',
      'erotismo',
      'fantasías',
      'fantasias',
      'goce',
      'soberanía del goce',
      'soberania del goce',
    ],
    regexList: [
      /\b(placer\s+sexual|derecho\s+al\s+placer|soberan[ií]a\s+del\s+goce)\b/i,
      /\b(consentimiento\s+din[aá]mico|acuerdos\s+sexuales|safeword|palabra\s+de\s+seguridad)\b/i,
      /\b(bdsm|fisting|kink|roleplay|no\s+monogam\w*|poliamor)\b/i,
      /\b(erotismo|deseo\s+sexual|identidad\s+y\s+expresi[oó]n)\b/i,
    ],
    technicalFocus: [
      'El placer como dimensión autónoma, no subordinada a objetivos preventivos',
      'Consentimiento dinámico: continuo, explícito, informado y revocable en cualquier momento',
      'Comunicación transparente de acuerdos, límites y palabras de seguridad (safewords)',
      'Acompañamiento afirmativo en identidades, expresiones y modelos relacionales diversos',
    ],
  },

  // 4. AUTOGESTIÓN EN EL CONSUMO NO PROBLEMÁTICO DE SUSTANCIAS PSICOTRÓPICAS
  {
    type: 'consumo-psicotropicas',
    number: 4,
    label: '4. Autogestión en el Consumo No Problemático de Sustancias Psicotrópicas',
    shortLabel: '4. Psicotrópicas',
    badgeLabel: '4. Consumo de Psicotrópicas',
    description:
      'Consumo recreativo vs consumo problemático, alcohol, cannabis, cocaína, MDMA, estimulantes, disociativos, depresores, contexto y frecuencia. No supone automáticamente problema, sin diagnóstico ni etiquetado.',
    aphorism: 'CONSUMO ≠ PROBLEMA — El problema lo identifica la persona, no Will.',
    keywords: [
      'consumo recreativo',
      'sustancias psicotrópicas',
      'sustancias psicotropicas',
      'psicotrópicas',
      'psicotropicas',
      'drogas recreativas',
      'alcohol',
      'cannabis',
      'marihuana',
      'hachís',
      'hachis',
      'cocaína',
      'cocaina',
      'coca',
      'mdma',
      'éxtasis',
      'extasis',
      'cristal mdma',
      'setas',
      'psilocibina',
      'lsd',
      'ácido',
      'acido',
      'estimulantes',
      'anfetamina',
      'speed',
      'disociativos',
      'ketamina',
      'keta',
      'depresores',
      'benzodiacepinas',
      'trankimazin',
      'alprazolam',
      'diazepam',
      'opiáceos',
      'opiaceos',
      'contexto y frecuencia',
      'set and setting',
      'dosis',
      'dosificación',
      'dosificacion',
      'vida media',
      'cocaetileno',
    ],
    regexList: [
      /\b(consumo\s+recreativo|sustancias?\s+psicotr[oó]picas?)\b/i,
      /\b(coca[ií]na|cannabis|marihuana|mdma|[eé]xtasis|psilocibina|lsd)\b/i,
      /\b(anfetamina|speed|ketamina|keta|benzodiacepina\w*|cocaetileno)\b/i,
      /\b(set\s+and\s+setting|dosificaci[oó]n|vida\s+media)\b/i,
    ],
    technicalFocus: [
      'Diferenciación científica entre consumo recreativo y consumo problemático',
      'Farmacocinética, mecanismo neuroquímico, vidas medias y curvas de efecto',
      'Análisis de interacciones y sinergias (p. ej. cocaetileno, sinergias depresoras)',
      'Decisión personal informada sin diagnósticos ni etiquetas automáticas',
    ],
  },

  // 5. AUTOGESTIÓN EN LA REDUCCIÓN DE RIESGOS Y DAÑOS DEL CHEMSEX
  {
    type: 'chemsex',
    number: 5,
    label: '5. Autogestión en la Reducción de Riesgos y Daños del Chemsex',
    shortLabel: '5. Chemsex',
    badgeLabel: '5. Chemsex',
    description:
      'Chemsex: sexo + sustancias para prolongar o intensificar. No implica automáticamente problema. Sustancias frecuentes (mefedrona, GHB/GBL, poppers, etc.), efectos, interacciones, riesgos en contexto sexual, reducción de riesgos y daños, señales de alarma y recursos.',
    aphorism: 'CHEMSEX NO ES SINÓNIMO DE PROBLEMA NI DE SLAM — Es un contexto específico.',
    keywords: [
      'chemsex',
      'chem',
      'chems',
      'sexo químico',
      'sexo quimico',
      'sexo con drogas',
      'sesión de chem',
      'sesion de chem',
      'chill',
      'chillout',
      'mefedrona',
      '4-mmc',
      '4mmc',
      '3-mmc',
      '3mmc',
      'miaw',
      'mefe',
      'catinona',
      'catinonas',
      'ghb',
      'gbl',
      'éxtasis líquido',
      'extasis liquido',
      'chorro',
      'chorri',
      'g-out',
      'gout',
      'tina en chemsex',
      'cristal en chemsex',
      'poppers',
      'popper',
      'alfa-pihp',
      'alfa-pvp',
      'alpha-pihp',
      'monkey dust',
      'tusi nexus',
      '2c-b',
      'booty bumping',
      'booty bump',
      'vía rectal en chemsex',
      'redosing',
      'redosis',
      'redosificación',
      'bajada de chem',
    ],
    regexList: [
      /\b(chemsex|chems?|sexo\s+qu[ií]mico|sesi[oó]n\s+de\s+chem)\b/i,
      /\b(mefedrona|4-mmc|3-mmc|catinona\w*)\b/i,
      /\b(ghb|gbl|g-out|gout|[eé]xtasis\s+l[ií]quido)\b/i,
      /\b(booty\s+bump\w*|bajada\s+de\s+chem|redosing)\b/i,
    ],
    technicalFocus: [
      'Farmacología e interacciones específicas en contexto de sexo prolongado',
      'Margen de seguridad estrecho del GHB/GBL (cero mezclas con alcohol o depresores)',
      'Protección de mucosas y lubricación para evitar microlesiones y transmisión',
      'Consentimiento continuo y dinámico ante estados de desinhibición intensa',
      'Detección de señales de alarma (G-out, hipertermia, arritmias) y Posición Lateral de Seguridad',
    ],
  },

  // 6. AUTOGESTIÓN EN LA REDUCCIÓN DE RIESGOS Y DAÑOS DEL SLAM
  {
    type: 'slam',
    number: 6,
    label: '6. Autogestión en la Reducción de Riesgos y Daños del SLAM',
    shortLabel: '6. SLAM',
    badgeLabel: '6. SLAM',
    description:
      'SLAM: uso intravenoso en contexto sexual. Identidad propia (no subordinada a chemsex). No implica automáticamente problema. Riesgos objetivos (infecciones, vasculares, sobredosis), señales de alarma, reducción de riesgos y daños, recursos adecuados. Sin instrucciones operativas ni manuales de ejecución.',
    aphorism: 'SLAM NO ES SINÓNIMO DE CHEMSEX — Puede coexistir o existir de forma independiente.',
    keywords: [
      'slam',
      'slamming',
      'slamme',
      'slammeando',
      'slammer',
      'uso intravenoso',
      'inyección intravenosa',
      'inyeccion intravenosa',
      'inyección en chemsex',
      'inyeccion en chemsex',
      'venas',
      'vena',
      'venopunción',
      'venopuncion',
      'aguja',
      'agujas',
      'jeringa',
      'jeringas',
      'jeringuilla',
      'cazoleta',
      'cazoletas',
      'filtro de membrana',
      'filtro de rueda',
      'filtro estéril',
      'agua para inyección',
      'flebitis',
      'esclerosis venosa',
      'colapso venoso',
      'hematoma venoso',
      'trombosis',
      'absceso',
      'abscesos',
      'celulitis bacteriana',
      'bacteriemia',
      'sepsis',
      'endocarditis',
      'punción arterial',
      'puncion arterial',
      'extravasación',
      'extravasacion',
      'rotación de venas',
      'rotacion de venas',
      'cuidados vasculares',
      'salud vascular',
      'material estéril intransferible',
      'material esteril intransferible',
      'programa intercambio de jeringas',
      'pij',
    ],
    regexList: [
      /\b(slam|slamming|slamme\w*)\b/i,
      /\b(uso\s+intravenoso|inyecci[oó]n\s+intravenosa|venopunci[oó]n)\b/i,
      /\b(flebitis|esclerosis\s+venosa|extravasaci[oó]n|punci[oó]n\s+arterial)\b/i,
      /\b(rotaci[oó]n\s+de\s+venas|cuidados?\s+vascular\w*|endocarditis|sepsis)\b/i,
      /\b(cazoleta\w*|filtro\s+de\s+membrana|material\s+est[eé]ril)\b/i,
    ],
    technicalFocus: [
      'Identidad técnica diferenciada e independiente del SLAM',
      'Riesgos objetivos vasculares (flebitis, colapso, trombosis, extravasación) e infecciosos (VIH, VHC, endocarditis, sepsis)',
      'Principio de material estéril intransferible y asepsia por intento',
      'Rotación sistemática de venas y preservación del endotelio vascular',
      'Señales de alarma médica urgente (punción arterial, dolor torácico, fiebre de sepsis)',
      'Información científica y de mitigación sin manuales ni recetas operacionales de punción',
    ],
  },
];

export function detectContext(
  text: string,
  history?: Array<{ role: string; content: string }>
): DetectedContextInfo {
  const defaultInfo: DetectedContextInfo = {
    type: 'acompanamiento',
    label: '1. Acompañamiento No Directivo, No Prescriptivo y No Diagnóstico',
    badgeLabel: '1. Acompañamiento No Directivo',
    description:
      'Espacio abierto de consulta y escucha sin juicio bajo el marco P.R.E.S.E.N.T.E.',
    keywordsMatched: [],
    technicalFocus: [
      'Escucha activa sin juicio ni inducción de conductas',
      'Respeto incondicional a la soberanía decisional del usuario',
    ],
  };

  if (!text || typeof text !== 'string') return defaultInfo;

  // Aggregate user text and last 2 messages for better context detection
  let contextPool = text.toLowerCase();
  if (history && history.length > 0) {
    const recent = history.slice(-2).map((m) => m.content).join(' ').toLowerCase();
    contextPool = `${recent} ${contextPool}`;
  }

  // Priority check: SLAM (most specific) -> Chemsex -> Salud Sexual -> Placer -> Psicotrópicas -> Acompañamiento
  for (const pattern of CANONICAL_CONTEXT_PATTERNS) {
    const matchedKeywords: string[] = [];

    for (const kw of pattern.keywords) {
      if (contextPool.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      }
    }

    const regexMatched = pattern.regexList.some((regex) => regex.test(contextPool));

    if (matchedKeywords.length >= 1 || regexMatched) {
      return {
        type: pattern.type,
        label: pattern.label,
        badgeLabel: pattern.badgeLabel,
        description: pattern.description,
        keywordsMatched: matchedKeywords.slice(0, 5),
        technicalFocus: pattern.technicalFocus,
      };
    }
  }

  return defaultInfo;
}

export function getAllContextCategories(): ContextCategoryConfig[] {
  return CANONICAL_CONTEXT_PATTERNS;
}
