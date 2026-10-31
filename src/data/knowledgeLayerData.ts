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
    'KAIROS (adquisición médico-científica/comunitaria para el RAG) / DIKE (adquisición jurídico-legal y normativa, incluida la dimensión jurídico-legal médica)',
    'CORPUS VALIDADO',
    'RAG',
    'CONOCIMIENTO RELEVANTE',
    'WILL',
    'ACOMPAÑAMIENTO',
  ],
  kairos: {
    name: 'Kairos',
    dimension: 'médico-científica + comunitaria (adquisición para la biblioteca RAG de Will App)',
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
    limit: 'KAIROS no es Will App ni interactúa con el usuario; adquiere y prepara información médico-científica y comunitaria para nutrir su RAG. No decide la admisión al conocimiento canónico.',
  },
  dike: {
    name: 'Dike',
    dimension: 'jurídico-legal + normativa sobre IA/sistemas agénticos (prioridad UE/España) y jurídico-legal médica: medicina, investigación, práctica clínica y sociosanidad',
    functions: [
      'identificación de fuentes jurídicas',
      'jurisdicción',
      'vigencia',
      'modificaciones',
      'derogaciones',
      'normativa aplicable',
      'trazabilidad',
    ],
    limit: 'DIKE cubre la dimensión jurídico-legal médica, no la adquisición de información médico-científica y comunitaria, que corresponde a KAIROS. No decide la admisión al conocimiento canónico.',
  },
  ragRule:
    'El RAG recupera conocimiento relevante. No decide, no diagnostica, no prescribe, no recomienda, no dirige, no interpreta la vida de la persona.',
  internetRule:
    'Internet no entra directo a Will. Internet → fuente externa → clasificación → Kairos / Dike según naturaleza → verificación → conocimiento utilizable → Will.',
  provenance:
    'respuesta → fragmento → documento → fuente → autor/organización → fecha → versión → verificación',
  epistemic: ['VERIFICADO', 'INFERIDO', 'DESCONOCIDO'],
};

export const RRRR_RRDD_CLASSIFICATION = {
  title: 'RRRR + RRDD',
  subtitle: 'REDUCCIÓN DE RIESGOS + REDUCCIÓN DE DAÑOS',
  dimensions: [
    { id: 'rrrr' as const, label: 'RRRR — REDUCCIÓN DE RIESGOS', description: 'Reconocer, identificar, comprender y valorar los riesgos relevantes para la situación de la persona.' },
    { id: 'rrdd' as const, label: 'RRDD — REDUCCIÓN DE DAÑOS', description: 'Comprender posibles daños y factores que pueden reducir su impacto. No convierte una conducta en segura.' },
  ],
  branches: [{ id: 'rrdd-sexual' as const, label: 'RRDD SEXUAL' }, { id: 'rrdd-sustancias' as const, label: 'RRDD SUSTANCIAS' }],
  rule: 'La fórmula es siempre RRRR + RRDD. Son dimensiones distintas, complementarias y relacionadas. Chemsex y SLAM conservan identidad propia. Relación no significa equivalencia.',
};
