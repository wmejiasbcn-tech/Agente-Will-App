/**
 * Arquitectura conceptual WAIPL Knowledge Layer.
 * Texto tomado de la orden soberana de recalibración. No es un motor ejecutándose.
 */
export const WAIPL_KNOWLEDGE_LAYER = {
  title: 'WAIPL Knowledge Layer',
  principle: 'El RAG proporciona conocimiento. No proporciona decisiones.',
  stack: [
    'KNOWLEDGE REPOSITORY',
    'SOURCE REGISTRY',
    'TAXONOMY',
    'METADATA',
    'RAG ENGINE',
    'RETRIEVAL',
    'RERANKING',
    'KAIROS',
    'DIKE',
    'PROVENANCE',
    'VERSIONING',
    'UPDATE PIPELINE',
    'AUDIT',
  ],
  flow: [
    'FUENTES',
    'KNOWLEDGE LAYER',
    'KAIROS / DIKE',
    'CORPUS VALIDADO',
    'RAG',
    'CONOCIMIENTO RELEVANTE',
    'WILL',
    'ACOMPAÑAMIENTO',
  ],
  kairos: {
    name: 'Kairos',
    dimension: 'médico + científica + comunitaria',
    role: '¿Qué conocimiento tenemos y con qué grado de solidez podemos utilizarlo?',
    functions: [
      'búsqueda',
      'extracción',
      'evaluación',
      'contextualización',
      'contraste',
      'validación',
      'actualización',
      'registro del conocimiento pertinente',
    ],
    limit: 'Kairos no decide por Will. Kairos no sustituye a Dike en validación jurídica.',
  },
  dike: {
    name: 'Dike',
    dimension: 'legal + jurídica + normativa',
    functions: [
      'identificación de fuentes jurídicas',
      'jurisdicción',
      'vigencia',
      'modificaciones',
      'derogaciones',
      'normativa aplicable',
      'trazabilidad',
    ],
    limit: 'Dike no sustituye a Kairos en conocimiento médico-científico-comunitario.',
  },
  ragRule:
    'El RAG recupera conocimiento relevante. No decide, no diagnostica, no prescribe, no recomienda, no dirige, no interpreta la vida de la persona.',
  internetRule:
    'Internet no entra directo a Will. Internet → fuente externa → clasificación → Kairos / Dike según naturaleza → verificación → conocimiento utilizable → Will.',
  provenance:
    'respuesta → fragmento → documento → fuente → autor/organización → fecha → versión → verificación',
  epistemic: ['VERIFICADO', 'INFERIDO', 'DESCONOCIDO'],
};

export const RRDD_CLASSIFICATION = {
  title: 'REDUCCIÓN DE RIESGOS Y DAÑOS',
  branches: [
    {
      id: 'rrdd-sexual' as const,
      label: 'RRDD SEXUAL',
    },
    {
      id: 'rrdd-sustancias' as const,
      label: 'RRDD SUSTANCIAS',
    },
  ],
  rule: 'Esta clasificación es obligatoria. No fusionar ambas. No convertirlas en un único bloque indiferenciado. Chemsex y SLAM conservan identidad propia. Relación no significa equivalencia.',
};
