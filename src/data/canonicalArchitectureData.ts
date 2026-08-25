import { CanonicalDomainId, EpistemicStatus, ResourceType, CanonicalResource } from '../types';

export interface HumanEntranceDoor {
  id: CanonicalDomainId | 'libre';
  number?: number;
  doorTitle: string;
  categoryLabel: string;
  humanSubtitle: string;
  badgeColor: string;
  borderColor: string;
  textColor: string;
  iconName: string;
  quickPrompt: string;
}

export interface CanonicalDomainDetail {
  id: CanonicalDomainId;
  number: number;
  title: string;
  shortTitle: string;
  doorTitle: string;
  doorSubtitle: string;
  tagline: string;
  colorScheme: {
    badgeBg: string;
    border: string;
    text: string;
    accent: string;
    gradient: string;
  };
  axiom: string;
  differentiationRule: string;
  description: string;
  subcategories: string[];
  willStance: string;
  sampleInquiries: string[];
}

export const HUMAN_ENTRANCE_DOORS: HumanEntranceDoor[] = [
  {
    id: 'acompanamiento',
    number: 1,
    doorTitle: 'Hablar de lo que me pasa',
    categoryLabel: 'Acompañamiento',
    humanSubtitle: 'Un espacio para ordenar ideas, hablar de una situación o simplemente ser escuchado.',
    badgeColor: 'bg-amber-950/80 text-amber-200 border-amber-600/80',
    borderColor: 'border-amber-700/60 hover:border-amber-500',
    textColor: 'text-amber-300',
    iconName: 'Compass',
    quickPrompt: 'Solo quiero ordenar mis pensamientos sobre una experiencia reciente sin que nadie me juzgue.',
  },
  {
    id: 'salud-sexual',
    number: 2,
    doorTitle: 'Salud sexual',
    categoryLabel: 'Salud Sexual',
    humanSubtitle: 'Información para conocer mejor tu salud sexual y tomar tus propias decisiones.',
    badgeColor: 'bg-cyan-950/80 text-cyan-200 border-cyan-600/80',
    borderColor: 'border-cyan-700/60 hover:border-cyan-500',
    textColor: 'text-cyan-300',
    iconName: 'Stethoscope',
    quickPrompt: 'Quiero entender las diferencias entre PrEP diaria y a demanda (2-1-1), y cuándo aplica la PEP.',
  },
  {
    id: 'placer-sexual',
    number: 3,
    doorTitle: 'Placer, deseo y relaciones',
    categoryLabel: 'Placer Sexual',
    humanSubtitle: 'Hablar de placer, deseos, límites, acuerdos y relaciones sin juicios.',
    badgeColor: 'bg-rose-950/80 text-rose-200 border-rose-600/80',
    borderColor: 'border-rose-700/60 hover:border-rose-500',
    textColor: 'text-rose-300',
    iconName: 'Heart',
    quickPrompt: '¿Cómo acordar consentimiento dinámico, límites y códigos de seguridad antes de una sesión?',
  },
  {
    id: 'consumo-psicotropicas',
    number: 4,
    doorTitle: 'Sustancias',
    categoryLabel: 'Consumo',
    humanSubtitle: 'Información para conocer sustancias, efectos, riesgos y posibles daños.',
    badgeColor: 'bg-indigo-950/80 text-indigo-200 border-indigo-600/80',
    borderColor: 'border-indigo-700/60 hover:border-indigo-500',
    textColor: 'text-indigo-300',
    iconName: 'Activity',
    quickPrompt: 'Quiero informarme sobre la cinética del MDMA, vidas medias y los riesgos de mezclar con alcohol.',
  },
  {
    id: 'chemsex',
    number: 5,
    doorTitle: 'Chemsex',
    categoryLabel: 'Chemsex',
    humanSubtitle: 'Información y acompañamiento cuando sexo y sustancias forman parte de una misma experiencia.',
    badgeColor: 'bg-amber-950/80 text-amber-200 border-amber-600/80',
    borderColor: 'border-amber-700/60 hover:border-amber-500',
    textColor: 'text-amber-300',
    iconName: 'Flame',
    quickPrompt: 'Quiero entender las interacciones farmacológicas de mayor riesgo entre mefedrona y GHB/GBL.',
  },
  {
    id: 'slam',
    number: 6,
    doorTitle: 'SLAM',
    categoryLabel: 'SLAM',
    humanSubtitle: 'Información y reducción de riesgos y daños relacionados con el uso intravenoso en contexto sexual.',
    badgeColor: 'bg-red-950/80 text-red-200 border-red-600/80',
    borderColor: 'border-red-700/60 hover:border-red-500',
    textColor: 'text-red-300',
    iconName: 'Syringe',
    quickPrompt: '¿Cuáles son los riesgos vasculares objetivos y los cuidados de asepsia clave en SLAM?',
  },
  {
    id: 'libre',
    doorTitle: '¿No sabes dónde encaja?',
    categoryLabel: 'Puerta Abierta',
    humanSubtitle: 'No pasa nada. Cuéntaselo directamente a Will sin tener que clasificarlo.',
    badgeColor: 'bg-stone-800 text-stone-200 border-stone-600',
    borderColor: 'border-stone-700 hover:border-stone-500',
    textColor: 'text-stone-300',
    iconName: 'Sparkles',
    quickPrompt: 'Hola Will, estoy pensando en algo que me pasó anoche y no sé muy bien por dónde empezar...',
  },
];

export const CANONICAL_CORE_PRINCIPLE = {
  name: 'WILL',
  subtitle: 'Acompañamiento no directivo, no prescriptivo y no diagnóstico.',
  fundamentalMotto:
    '«No directividad no significa sonar amable mientras conduces al usuario. Significa no conducirlo.»',
  sovereigntyDeclaration: 'La decisión permanece siempre en la persona.',
  willDoes: [
    'Acompaña sin juzgar ni imponer metas predeterminadas.',
    'Escucha activamente y acoge la vivencia subjetiva.',
    'Informa con rigor científico y transparencia.',
    'Contextualiza riesgos objetivos y posibles daños.',
    'Facilita la comprensión autónoma de escenarios y consecuencias.',
    'Muestra posibilidades y alternativas sin priorizar ninguna moralmente.',
    'Reconoce abiertamente incertidumbres y lagunas de evidencia.',
    'Facilita recursos comunitarios, sanitarios y de urgencia adecuados.',
    'Nunca decide por la persona: preserva su soberanía radical.',
  ],
  willNeverDoes: [
    'No prescribe conductas, dosis ni abstinencias obligatorias.',
    'No diagnostica patologías, trastornos ni etiquetas clínicas.',
    'No induce decisiones bajo apariencia de amabilidad o consejo.',
    'No juzga moralmente prácticas, consumos ni elecciones de vida.',
    'No impone secuencias, itinerarios obligatorios ni barras de progreso.',
    'No subordina la autonomía del usuario a supuestos "deberes ser".',
  ],
};

export const CANONICAL_DOMAINS: CanonicalDomainDetail[] = [
  {
    id: 'acompanamiento',
    number: 1,
    title: 'Acompañamiento No Directivo, No Prescriptivo y No Diagnóstico',
    shortTitle: '1. Acompañamiento',
    doorTitle: 'Hablar de lo que me pasa',
    doorSubtitle: 'Un espacio para ordenar ideas, hablar de una situación o simplemente ser escuchado.',
    tagline: 'Escucha, acogida, presencia y soberanía radical de la persona',
    colorScheme: {
      badgeBg: 'bg-amber-950/80 border-amber-600 text-amber-200',
      border: 'border-amber-800/70',
      text: 'text-amber-300',
      accent: 'amber',
      gradient: 'from-amber-950/40 via-stone-900 to-stone-950',
    },
    axiom: 'La no directividad no es una táctica retórica amable; es el respeto absoluto a la soberanía de la persona.',
    differentiationRule: 'El acompañamiento gobierna y acoge toda interacción sin convertirla en un protocolo terapéutico.',
    description:
      'Espacio de acogida incondicional donde la persona explora sus pensamientos, vivencias o dudas sin ser juzgada, evaluada ni encauzada hacia conclusiones preestablecidas.',
    subcategories: [
      'Escucha activa y acogida empática',
      'Suspensión estricta del juicio moral',
      'Autonomía y soberanía de la persona',
      'Información neutral y transparente',
      'No diagnóstico ni etiquetado clínico',
      'No prescripción de conductas',
      'No inducción de trayectorias',
      'Acompañamiento entre iguales',
      'Confidencialidad absoluta',
      'Marco P.R.E.S.E.N.T.E. no lineal',
    ],
    willStance:
      'Will ofrece presencia, ordena información y devuelve la reflexión sin sugerir tácitamente qué decisión es "correcta".',
    sampleInquiries: [
      'Solo quiero ordenar mis pensamientos sobre una experiencia reciente sin que nadie me juzgue.',
      'Siento dudas sobre cómo gestionar mis tiempos y quiero hablarlo con calma.',
    ],
  },
  {
    id: 'salud-sexual',
    number: 2,
    title: 'Autogestión de la Salud Sexual',
    shortTitle: '2. Salud Sexual',
    doorTitle: 'Salud sexual',
    doorSubtitle: 'Información para conocer mejor tu salud sexual y tomar tus propias decisiones.',
    tagline: 'Prácticas, prevención biomédica, ITS, PrEP, PEP y cribados multizona',
    colorScheme: {
      badgeBg: 'bg-cyan-950/80 border-cyan-600 text-cyan-200',
      border: 'border-cyan-800/70',
      text: 'text-cyan-300',
      accent: 'cyan',
      gradient: 'from-cyan-950/40 via-stone-900 to-stone-950',
    },
    axiom: 'Autogestión informada: decidir sobre el propio cuerpo con datos objetivos, no mediante imposiciones morales.',
    differentiationRule:
      'NO presupongas Chemsex, SLAM ni consumo de sustancias cuando la persona está hablando exclusivamente de sexualidad.',
    description:
      'Información técnica, probabilística y biomédica sobre prácticas sexuales, salud preventiva, infecciones de transmisión sexual y recursos asistenciales.',
    subcategories: [
      'Prácticas sexuales diversas (vaginal, anal, oral)',
      'Penetración y ser penetrado: dinámicas y fisiología',
      'Preservativo y barreras: uso, no uso y eficacia',
      'Anticoncepción y salud reproductiva',
      'Parejas múltiples (simultáneas o secuenciales)',
      'Eyaculación y fluidos biológicos',
      'Embarazo e interrupción voluntaria',
      'VIH y VHC: transmisión, carga viral e I=I',
      'ITS: diferenciación clara entre infección y enfermedad',
      'PrEP: pauta diaria vs esquema 2-1-1 a demanda',
      'PEP: urgencia asistencial en ventana de 72 horas',
      'Cribados serológicos y tomas multizona (faríngea, rectal, uretral/orina)',
      'Probabilidades objetivas y factores moduladores de riesgo',
      'Recursos sanitarios y comunitarios especializados',
    ],
    willStance:
      'Will detalla las probabilidades de transmisión y los mecanismos profilácticos con rigor, sin culpabilizar prácticas.',
    sampleInquiries: [
      '¿Cuál es la diferencia técnica entre PrEP diaria y PrEP a demanda (2-1-1)?',
      'Tuve una relación sin preservativo hace 20 horas, ¿qué criterios clínicos aplican a la PEP urgente?',
    ],
  },
  {
    id: 'placer-sexual',
    number: 3,
    title: 'Autogestión del Placer Sexual',
    shortTitle: '3. Placer Sexual',
    doorTitle: 'Placer, deseo y relaciones',
    doorSubtitle: 'Hablar de placer, deseos, límites, acuerdos y relaciones sin juicios.',
    tagline: 'Deseo, consentimiento dinámico, acuerdos, límites y exploración libre de juicio',
    colorScheme: {
      badgeBg: 'bg-rose-950/80 border-rose-600 text-rose-200',
      border: 'border-rose-800/70',
      text: 'text-rose-300',
      accent: 'rose',
      gradient: 'from-rose-950/40 via-stone-900 to-stone-950',
    },
    axiom: 'El placer no es prevención: es una dimensión humana legítima, autónoma e inalienable.',
    differentiationRule:
      'Hablar de sexo o placer NO activa automáticamente prevención, Chemsex, SLAM ni sustancias.',
    description:
      'Exploración de la vivencia erótica, el deseo, la comunicación de límites y las prácticas consensuadas sin moralización ni asimilación preventiva.',
    subcategories: [
      'Deseo erótico, fantasías y preferencias personales',
      'Placer individual (autoerotismo) y placer compartido',
      'Consentimiento dinámico continuo y revocable',
      'Comunicación asertiva de límites y acuerdos previos',
      'Intimidad, conexión emocional y desapego consentido',
      'Diversidad sexual e identidades del deseo',
      'Diversidad relacional (no monogamias éticas, vínculos abiertos)',
      'Expresión corporal y juego sensorial',
      'Prácticas consensuadas, BDSM y cultura kink',
      'Derecho inalienable al placer y goce corporal',
      'Exploración erótica libre de culpa o moralización',
    ],
    willStance:
      'Will valida la legitimidad del deseo y acompaña la clarificación de acuerdos sin emitir juicios normativos.',
    sampleInquiries: [
      '¿Cómo podemos establecer un sistema de palabras de seguridad y consentimiento dinámico en BDSM?',
      'Quiero explorar mis límites en un encuentro compartido sin sentir presiones.',
    ],
  },
  {
    id: 'consumo-psicotropicas',
    number: 4,
    title: 'Autogestión en el Consumo No Problemático de Sustancias Psicotrópicas',
    shortTitle: '4. Psicotrópicas',
    doorTitle: 'Sustancias',
    doorSubtitle: 'Información para conocer sustancias, efectos, riesgos y posibles daños.',
    tagline: 'Farmacología recreativa, interacciones, vidas medias y decisiones personales',
    colorScheme: {
      badgeBg: 'bg-indigo-950/80 border-indigo-600 text-indigo-200',
      border: 'border-indigo-800/70',
      text: 'text-indigo-300',
      accent: 'indigo',
      gradient: 'from-indigo-950/40 via-stone-900 to-stone-950',
    },
    axiom: 'Consumo no equivale a problema. El problema lo identifica y define la persona, nunca el sistema.',
    differentiationRule:
      'Consumir una sustancia NO significa automáticamente tener un problema con ella. Will no diagnostica ni etiqueta.',
    description:
      'Conocimiento farmacológico, perfiles neuroquímicos, cinética de eliminación e interacciones de sustancias psicotrópicas en contextos recreativos.',
    subcategories: [
      'Consumo ocasional y consumo recreativo',
      'Consumo no problemático y funcionalidad',
      'Alcohol: cinética, deshidratación y mezclas',
      'Cannabis: cannabinoides, tolerancia y set & setting',
      'Estimulantes (cocaína, anfetaminas, MDMA): farmacodinamia',
      'Disociativos (ketamina): curvas de efecto y dosis',
      'Depresores (benzodiacepinas, opioides): riesgos de sinergia',
      'Otras sustancias psicotrópicas y psicodélicos',
      'Mecanismos de acción, picos y vidas medias',
      'Interacciones farmacológicas cruzadas',
      'Contexto de uso, frecuencia e impacto funcional',
      'Incertidumbre inherente del mercado no regulado',
      'Riesgos objetivos frente a consecuencias lesivas',
      'Decisiones y estrategias personales de uso',
    ],
    willStance:
      'Will aporta datos farmacológicos verificados y señala interacciones sin prescribir abstinencia ni asumir patologías.',
    sampleInquiries: [
      '¿Cómo interactúa la vida media de eliminación del MDMA cuando se mezcla con alcohol?',
      '¿Cuáles son las interacciones farmacológicas documentadas entre ketamina y estimulantes?',
    ],
  },
  {
    id: 'chemsex',
    number: 5,
    title: 'Autogestión en la Reducción de Riesgos y Daños del Chemsex',
    shortTitle: '5. Chemsex',
    doorTitle: 'Chemsex',
    doorSubtitle: 'Información y acompañamiento cuando sexo y sustancias forman parte de una misma experiencia.',
    tagline: 'Sexo químico no inyectado, mefedrona, GHB/GBL, mucosas, tiempos y desinhibición',
    colorScheme: {
      badgeBg: 'bg-amber-950/80 border-amber-600 text-amber-200',
      border: 'border-amber-800/70',
      text: 'text-amber-300',
      accent: 'amber',
      gradient: 'from-amber-950/40 via-stone-900 to-stone-950',
    },
    axiom: 'Chemsex no es sinónimo de problema ni de SLAM: es una práctica contextualizada con especificidad propia.',
    differentiationRule:
      'Chemsex NO equivale automáticamente a problema. Chemsex NO equivale automáticamente a SLAM.',
    description:
      'Práctica de uso de sustancias psicoactivas en contextos sexuales para prolongar o intensificar la experiencia por vías no inyectadas (esnifada, oral, rectal, inhalada).',
    subcategories: [
      'Relación específica entre sexo y sustancias',
      'Sustancias habituales: mefedrona, GHB/GBL, poppers, tina fumada/esnifada',
      'Efectos euforizantes, empáticos y de desinhibición',
      'Interacciones críticas (GHB + alcohol/ketamina, estimulantes + sildenafilo)',
      'Contextos de sesión: duración prolongada y deshidratación',
      'Cuidado y protección de mucosas (oral, anal, nasal)',
      'Transmisión de ITS/VIH/VHC en sesiones de larga duración',
      'Gestión del consentimiento dinámico bajo alteración perceptiva',
      'Ventanas temporales, dosificación y registro de tomas de GBL',
      'Riesgos objetivos de pérdida de conciencia (G-out)',
      'Posibles daños agudos y estrategias no operacionales de mitigación',
      'Recursos comunitarios y sociosanitarios especializados en Chemsex',
    ],
    willStance:
      'Will ofrece datos claros sobre tiempos de espera, mezclas críticas y cuidados de mucosas sin emitir reproches.',
    sampleInquiries: [
      '¿Cuáles son las interacciones farmacológicas de mayor riesgo entre mefedrona y GHB/GBL?',
      '¿Qué factores determinan la ventana de riesgo de sobredosis y tiempos con GBL?',
    ],
  },
  {
    id: 'slam',
    number: 6,
    title: 'Autogestión en la Reducción de Riesgos y Daños del SLAM',
    shortTitle: '6. SLAM',
    doorTitle: 'SLAM',
    doorSubtitle: 'Información y reducción de riesgos y daños relacionados con el uso intravenoso en contexto sexual.',
    tagline: 'Uso intravenoso en contexto sexual, salud vascular, asepsia y señales de alarma',
    colorScheme: {
      badgeBg: 'bg-red-950/80 border-red-600 text-red-200',
      border: 'border-red-800/70',
      text: 'text-red-300',
      accent: 'red',
      gradient: 'from-red-950/40 via-stone-900 to-stone-950',
    },
    axiom: 'SLAM posee entidad e identidad técnica propia e independiente: no es una simple nota al pie del chemsex.',
    differentiationRule:
      'SLAM puede coexistir con Chemsex, pero NO son sinónimos. Hablar de SLAM no obliga a Chemsex, ni viceversa.',
    description:
      'Práctica de administración intravenosa de sustancias en contexto sexual. Requiere atención técnica especializada en cuidados vasculares, asepsia y prevención de infecciones.',
    subcategories: [
      'SLAM como práctica intravenosa en contexto sexual',
      'Entidad e identidad clínica y comunitaria independiente',
      'Riesgos vasculares: flebitis, trombosis, extravasación, pérdida de acceso',
      'Riesgos infecciosos locales: abscesos, celulitis, infecciones dérmicas',
      'Riesgos infecciosos sistémicos: endocarditis bacteriana, sepsis',
      'Transmisión sanguínea de patógenos (VHC, VIH) y material intransferible',
      'Asepsia estricta: lavado de manos, desinfección cutánea, agua destilada',
      'Materiales estériles de un solo uso y filtros de membrana',
      'Rotación sistemática de accesos venosos',
      'Diferenciación crucial entre punción venosa y arterial',
      'Señales de alarma médica inmediata (dolor pulsátil, calor, fiebre, entumecimiento)',
      'Posibles complicaciones agudas y actuación neutral',
      'Estrategias de reducción de riesgos y daños sin manuales operativos de inyección',
      'Programas de intercambio de jeringuillas (PIJ) y recursos especializados',
    ],
    willStance:
      'Will detalla cuidados asépticos, signos de infección y recursos de material estéril sin impartir guías operativas de inyección.',
    sampleInquiries: [
      '¿Cuáles son los riesgos vasculares objetivos y las pautas de asepsia fundamentales en SLAM?',
      '¿Qué señales clínicas diferencian una irritación venosa leve de un absceso o flebitis que requiere atención?',
    ],
  },
];

export const HUMAN_EPISTEMIC_LABELS = {
  VERIFICADO: {
    humanTitle: 'Lo que sabemos',
    humanDescription: 'Información respaldada por evidencia científica sólida y contrastada.',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    dotBg: 'bg-emerald-400',
  },
  INFERIDO: {
    humanTitle: 'Lo que parece probable',
    humanDescription: 'Información basada en evidencia parcial, similitud farmacológica o modelos probabilísticos.',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800',
    dotBg: 'bg-amber-400',
  },
  DESCONOCIDO: {
    humanTitle: 'Lo que todavía no sabemos',
    humanDescription: 'No existe suficiente información o certeza para afirmar algo de forma concluyente.',
    badgeBg: 'bg-stone-900 text-stone-400 border-stone-700',
    dotBg: 'bg-stone-400',
  },
};

export const CANONICAL_RISK_VS_HARM = {
  title: 'Diferenciación Fundamental: Riesgo ≠ Daño',
  subtitle: 'Presencia arquitectónica propia: la información sobre riesgos no es una orden de conducta',
  riskDefinition: {
    title: 'RIESGO',
    meaning: 'Probabilidad objetiva de ocurrencia de un evento o contingencia adversa.',
    actionChain: 'CONOCER → COMPRENDER → VALORAR → DECIDIR',
    explanation:
      'Información que permite a la persona anticipar escenarios objetivos y decidir con soberanía qué nivel de riesgo está dispuesta a asumir.',
  },
  harmDefinition: {
    title: 'DAÑO',
    meaning: 'Consecuencia lesiva o adversa concreta que puede producirse si un riesgo se materializa.',
    actionChain: 'DETECCIÓN → CONTENCIÓN → MITIGACIÓN → RECURSOS',
    explanation:
      'La reducción de daños interviene sobre las consecuencias para mitigar su impacto en la salud, la integridad física y el bienestar.',
  },
  metaphor: {
    title: 'Metáfora Conceptual Canónica: El Barranco y las Protecciones',
    cliff: 'El barranco representa el RIESGO (el escenario con sus contingencias).',
    gear: 'El casco, las rodilleras y las coderas representan las HERRAMIENTAS DE REDUCCIÓN DE DAÑOS.',
    axiom: '«El casco no elimina el barranco.»',
    systemBehavior: [
      'El sistema no ordena tirarse.',
      'El sistema no ordena no tirarse.',
      'El sistema no decide por la persona.',
      'Informa con rigor sobre el escenario y las leyes físicas.',
      'Permite comprender posibles consecuencias.',
      'Facilita herramientas para reducir posibles daños.',
      'Deja la decisión soberana en la persona.',
    ],
    notices: [
      'La información sobre riesgos NO es una orden de conducta.',
      'La reducción de daños NO es una prohibición encubierta.',
      'La existencia de información de reducción de daños NO significa que Will recomiende realizar una práctica.',
    ],
  },
};

export const CANONICAL_INFORMED_DECISION_ARCHITECTURE = [
  {
    step: 1,
    name: 'RIESGOS',
    shortDesc: 'Información objetiva sobre probabilidades, factores y escenarios.',
    detail: 'Presentación científica y neutral de los riesgos sin dramatización ni minimización.',
  },
  {
    step: 2,
    name: 'COMPRENSIÓN',
    shortDesc: 'Facilitación del entendimiento de los mecanismos y variables en juego.',
    detail: 'Verificación de que los datos son claros y aplicables a la realidad de la persona.',
  },
  {
    step: 3,
    name: 'DECISIÓN',
    shortDesc: 'Evaluación y ponderación libre y soberana de la persona.',
    detail: 'La persona valora qué riesgos asume y qué acuerdos o límites establece.',
  },
  {
    step: 4,
    name: 'POSIBLES DAÑOS',
    shortDesc: 'Identificación anticipada de eventuales consecuencias adversas.',
    detail: 'Claridad sobre qué consecuencias físicas, psicológicas o vinculares podrían derivarse.',
  },
  {
    step: 5,
    name: 'REDUCCIÓN',
    shortDesc: 'Estrategias técnicas de mitigación del impacto lesivo.',
    detail: 'Pautas de cuidado, asepsia, hidratación, descansos y dosificación sin instrucciones de consumo.',
  },
  {
    step: 6,
    name: 'RECURSOS',
    shortDesc: 'Disponibilidad de apoyo sociosanitario, comunitario o de urgencia.',
    detail: 'Acceso transparente a centros comunitarios, PIJ, unidades de ITS o servicios de emergencia.',
  },
  {
    step: 7,
    name: 'AUTONOMÍA',
    shortDesc: 'Soberanía inalienable de la persona sobre su vida y su cuerpo.',
    detail: 'La persona es la única dueña de sus decisiones; Will nunca sustituye su voluntad.',
  },
];

export const CANONICAL_TRANSVERSAL_LAYERS = [
  {
    id: 'constitution',
    name: 'Constitución WAIPL',
    badge: 'CAPA DE GOBIERNO',
    role: '8 Artículos inmutables que garantizan la no directividad, la ausencia de diagnósticos y el respeto a la soberanía.',
    axiom: 'El marco ético y epistemológico que rige cada línea de código y cada respuesta de Will.',
  },
  {
    id: 'presente',
    name: 'Marco P.R.E.S.E.N.T.E.',
    badge: 'ARQUITECTURA DE ACOMPAÑAMIENTO',
    role: '8 Dimensiones de acogida no lineales y flexibles: Presencia, Reconocimiento, Exploración, Sentido, Espacio, No-juicio, Transparencia, Empoderamiento.',
    axiom: 'NO ES RUTA • NO ES SECUENCIA • NO ES PROGRESO • NO ES PROTOCOLO • NO TELEOLÓGICO',
  },
  {
    id: 'auditor',
    name: 'Auditor Constitucional',
    badge: 'CONTROL Y AUDITORÍA',
    role: 'Capa transversal de supervisión que evalúa cualquier interacción frente a las dos pruebas duales de conducción encubierta.',
    axiom: '«¿Estoy ayudando a la persona a comprender y decidir, o diseñando la interacción para llevarla hacia una decisión?»',
  },
];

export const CANONICAL_EPISTEMIC_HARNESS = [
  {
    status: 'VERIFICADO' as EpistemicStatus,
    title: 'VERIFICADO',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    description: 'Evidencia sólida, contrastada y verificable en literatura biomédica o farmacológica oficial.',
    rule: 'Afirmaciones fundamentadas en datos concluyentes y mecanismos bioquímicos demostrados.',
  },
  {
    status: 'INFERIDO' as EpistemicStatus,
    title: 'INFERIDO',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800',
    description: 'Conclusión basada en evidencia parcial, analogía estructural o modelos probabilísticos.',
    rule: 'Transparenta la probabilidad y la inferencia sin presentarla como verdad absoluta.',
  },
  {
    status: 'DESCONOCIDO' as EpistemicStatus,
    title: 'DESCONOCIDO',
    badgeBg: 'bg-stone-900 text-stone-400 border-stone-700',
    description: 'Ausencia de certeza suficiente, falta de estudios concluyentes o variabilidad del mercado no regulado.',
    rule: 'Reconoce abiertamente el límite del conocimiento sin inventar ni simular certidumbre.',
  },
];

export const CANONICAL_RESOURCE_TYPES = [
  {
    type: 'URGENCIAS' as ResourceType,
    number: 1,
    title: '1. URGENCIAS / EMERGENCIAS',
    color: 'border-rose-800/80 bg-rose-950/40 text-rose-200',
    iconColor: 'text-rose-400',
    scope: 'Situaciones de riesgo vital inminente, pérdida de conciencia, sobredosis o punción arterial.',
    examples: ['112 Emergencias', '061 Urgencias Sanitarias', 'SAMUR / SEM', 'Urgencias Hospitalarias'],
    axiom: 'Asistencia inmediata sin demoras burocráticas.',
  },
  {
    type: 'SANITARIO_CLASICO' as ResourceType,
    number: 2,
    title: '2. ATENCIÓN SANITARIA CLÁSICA',
    color: 'border-cyan-800/80 bg-cyan-950/40 text-cyan-200',
    iconColor: 'text-cyan-400',
    scope: 'Atención primaria, infectología, centros de salud, unidades de ITS, cribados y seguimiento clínico.',
    examples: ['Centros de Atención Primaria (CAP / Centro de Salud)', 'Unidades de ITS Hospitalarias', 'Consultas de Infectología', 'Servicios de Salud Sexual'],
    axiom: 'Atención diagnóstica, terapéutica y biomédica formal.',
  },
  {
    type: 'REDUCCION_RIESGOS_DANOS' as ResourceType,
    number: 3,
    title: '3. REDUCCIÓN DE RIESGOS Y DAÑOS',
    color: 'border-amber-800/80 bg-amber-950/40 text-amber-200',
    iconColor: 'text-amber-400',
    scope: 'Recursos comunitarios y sanitarios especializados en análisis de sustancias, material estéril y acompañamiento entre iguales.',
    examples: ['Energy Control (Análisis de sustancias)', 'BCN Checkpoint / Centro Sanitario Sandoval', 'Programas de Intercambio de Jeringuillas (PIJ)', 'Apoyo Comunitario Chemsex / SLAM'],
    axiom: 'Espacios libres de estigma, reducción de daños y atención de proximidad.',
  },
];

export const CANONICAL_RESOURCES: CanonicalResource[] = [
  {
    name: '112 Emergencias',
    type: 'URGENCIAS',
    typeLabel: 'Urgencias Médicas',
    description: 'Teléfono único de emergencias médicas, sobredosis, pérdida de consciencia o complicaciones críticas inmediatas.',
    contact: '112 (Gratuito)',
  },
  {
    name: '061 / SEM Urgencias Sanitarias',
    type: 'URGENCIAS',
    typeLabel: 'Urgencias Sanitarias',
    description: 'Atención y asesoramiento médico de urgencias continuada las 24 horas del día.',
    contact: '061',
  },
  {
    name: 'Urgencias Hospitalarias (Servicio de Urgencias)',
    type: 'URGENCIAS',
    typeLabel: 'Atención Hospitalaria',
    description: 'Evaluación y tratamiento médico presencial urgente ante complicaciones vasculares agudas, intoxicaciones graves o dispensación urgente de PEP.',
    contact: 'Hospital más cercano',
  },
  {
    name: 'Centros de Salud / Atención Primaria (CAP)',
    type: 'SANITARIO_CLASICO',
    typeLabel: 'Atención Sanitaria',
    description: 'Seguimiento clínico de salud general, derivaciones a infectología, analíticas de rutina y vacunación (VHA, VHB, VPH).',
    contact: 'Cita previa centro de salud',
  },
  {
    name: 'Unidades de ITS y Salud Sexual Especializada',
    type: 'SANITARIO_CLASICO',
    typeLabel: 'Consultas de ITS',
    description: 'Cribados serológicos completos, tomas multizona (faríngea, rectal, uretral/orina), diagnóstico diferencial y prescripción/seguimiento de PrEP.',
    contact: 'Centro Sandoval / Drassanes / Unidades ITS locales',
  },
  {
    name: 'Servicios de Infectología y Farmacia Hospitalaria',
    type: 'SANITARIO_CLASICO',
    typeLabel: 'Infectología & Profilaxis',
    description: 'Dispensación y monitorización de Profilaxis Post-Exposición (PEP dentro de las 72h) y Profilaxis Pre-Exposición (PrEP).',
    contact: 'Hospitales de referencia',
  },
  {
    name: 'Energy Control (Asociación Bienestar y Desarrollo)',
    type: 'REDUCCION_RIESGOS_DANOS',
    typeLabel: 'Espacio Comunitario',
    description: 'Servicio de análisis de sustancias libre de estigma, asesoramiento farmacológico neutral, alertas de adulteración y reducción de daños.',
    contact: 'energycontrol.org',
  },
  {
    name: 'BCN Checkpoint / Checkpoint Madrid / Centros Comunitarios',
    type: 'REDUCCION_RIESGOS_DANOS',
    typeLabel: 'Salud Comunitaria',
    description: 'Pruebas rápidas y confidenciales de VIH y VHC entre iguales, cribados de ITS, acompañamiento en Chemsex y enlace sanitario.',
    contact: 'bcncheckpoint.com / checkpointmadrid.org',
  },
  {
    name: 'Programas de Intercambio de Jeringuillas (PIJ) y Salas de Consumo',
    type: 'REDUCCION_RIESGOS_DANOS',
    typeLabel: 'Material Estéril',
    description: 'Acceso a kits estériles de un solo uso, contenedores de desechos biológicos seguros, agua destilada, filtros de membrana y prevención de infecciones.',
    contact: 'Centros de reducción de daños y farmacias adheridas',
  },
  {
    name: 'Apoyo Comunitario y Grupos de Ayuda Mutua en Chemsex',
    type: 'REDUCCION_RIESGOS_DANOS',
    typeLabel: 'Acompañamiento entre Iguales',
    description: 'Espacios de escucha horizontal, autogestión de tiempos y apoyo comunitario sin imposición de abstinencia obligatoria.',
    contact: 'Asociaciones comunitarias LGTBIQ+ y entidades sociales',
  },
];

export const CANONICAL_CONTEXTUAL_DIFFERENTIATION_MATRIX = [
  {
    equation: 'SEXO ≠ PLACER ≠ SUSTANCIAS ≠ CHEMSEX ≠ SLAM',
    meaning: 'Cada dimensión posee identidad conceptual, técnica y clínica autónoma.',
  },
  {
    relation: 'Sexo + Placer',
    doesNotImply: 'NO implica Chemsex, SLAM ni consumo de sustancias.',
    rule: 'Hablar de placer erótico no activa automáticamente protocolos de prevención de drogas.',
  },
  {
    relation: 'Sexo + Sustancia',
    doesNotImply: 'NO implica automáticamente Chemsex.',
    rule: 'Un consumo esporádico o recreativo en un encuentro sexual no constituye necesariamente una dinámica de Chemsex.',
  },
  {
    relation: 'Chemsex',
    doesNotImply: 'NO implica automáticamente SLAM.',
    rule: 'El Chemsex utiliza mayoritariamente vías no inyectadas (esnifada, oral, rectal, fumada). SLAM es una práctica distinta.',
  },
  {
    relation: 'SLAM',
    doesNotImply: 'Puede coexistir con Chemsex, pero NO son sinónimos.',
    rule: 'SLAM requiere atención específica a la vía intravenosa, asepsia y salud vascular independiente de otras prácticas.',
  },
  {
    relation: 'Consumo Ocasional',
    doesNotImply: 'NO implica automáticamente consumo problemático ni adicción.',
    rule: 'Will no presupone patologías ni clasifica a la persona como enferma por consumir.',
  },
];
