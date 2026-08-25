import { CanonicalDomainDefinition, SubstanceInfo } from '../types';

export const CANONICAL_DOMAINS: CanonicalDomainDefinition[] = [
  {
    id: 'acompanamiento',
    number: 1,
    title: '1. ACOMPAÑAMIENTO NO DIRECTIVO, NO PRESCRIPTIVO Y NO DIAGNÓSTICO',
    shortTitle: '1. Acompañamiento No Directivo',
    tagline: 'Escucha sin juicio, presencia, acogida y respeto absoluto a la soberanía.',
    aphorismTitle: 'P.R.E.S.E.N.T.E.',
    aphorismText: 'Arquitectura no lineal: no es ruta, no es secuencia, no es protocolo teleológico.',
    description:
      'Espacio de presencia y neutralidad donde no se emiten juicios, diagnósticos ni prescripciones. Will no conduce al usuario: acompaña para que la persona decida con total autonomía.',
    bulletPoints: [
      'Escucha sin juicio y acogida incondicional',
      'Presencia y no inducción de conductas',
      'No diagnóstico ni etiquetado de la persona',
      'No prescripción médica o psicológica',
      'Información neutral con arnés epistemológico',
      'Transparencia algorítmica radical',
      'Empoderamiento y soberanía decisional',
      'Confidencialidad y privacidad estricta',
      'Marco P.R.E.S.E.N.T.E. disponible de forma no lineal'
    ],
    themeColor: 'blue',
    badgeBg: 'bg-blue-950/60 border-blue-800/60 text-blue-300'
  },
  {
    id: 'salud-sexual',
    number: 2,
    title: '2. AUTOGESTIÓN DE LA SALUD SEXUAL',
    shortTitle: '2. Autogestión de la Salud Sexual',
    tagline: 'Prácticas sexuales, cribados, VIH/VHC/ITS y profilaxis biomédica sin moralina.',
    aphorismTitle: 'AUTOGESTIÓN INFORMADA',
    aphorismText: 'Decidir con información, no imponer conductas.',
    description:
      'Información biomédica, prevención combinada, ITS (infección vs enfermedad), PrEP/PEP, cribado periódico multizona y recursos sanitarios para que cada persona gestione su salud sexual según sus decisiones.',
    bulletPoints: [
      'Prácticas sexuales diversas: vaginal, anal, oral, penetrar, ser penetrado',
      'Preservativo: uso o no uso informado y barreras de látex/poliuretano/nitrilo',
      'Anticoncepción y salud reproductiva',
      'Múltiples parejas: simultáneas o secuenciales',
      'Eyaculación / no eyaculación y fluidos biológicos',
      'ITS: diferenciación clara entre infección asintomática y enfermedad',
      'VIH / VHC / ITS bacterianas y virales',
      'PrEP (diaria vs esquema 2-1-1 a demanda) & PEP (urgencia 24-72h)',
      'Probabilidades y riesgos objetivos sin exageraciones ni alarmismo',
      'Cribado proporcional al riesgo en centros de salud y Checkpoints',
      'Recursos sanitarios públicos y comunitarios'
    ],
    themeColor: 'emerald',
    badgeBg: 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
  },
  {
    id: 'placer-sexual',
    number: 3,
    title: '3. AUTOGESTIÓN DEL PLACER SEXUAL',
    shortTitle: '3. Autogestión del Placer Sexual',
    tagline: 'Deseo, erotismo consciente, consentimiento dinámico y diversidad relacional.',
    aphorismTitle: 'EL PLACER NO ES PREVENCIÓN',
    aphorismText: 'El placer es una dimensión legítima y autónoma.',
    description:
      'El placer y la exploración erótica son fines en sí mismos, no un apéndice preventivo. Espacio libre de moralización para abordar deseos, fantasías, acuerdos, consentimiento explícito y límites.',
    bulletPoints: [
      'Deseo, preferencias y mapas eróticos individuales y compartidos',
      'Placer individual (masturbación, juguetes) y en pareja o grupal',
      'Consentimiento dinámico, explícito, informado y revocable',
      'Comunicación transparente, negociación de acuerdos y límites',
      'Exploración y diversidad de prácticas (BDSM, fisting, kink, roleplay)',
      'Identidad, expresión de género y vivencia sexogenérica diversa',
      'Intimidad, tiempos, cuidados afectivos y safewords',
      'Derecho al placer sin moralización, culpa ni juicio'
    ],
    themeColor: 'amber',
    badgeBg: 'bg-amber-950/60 border-amber-800/60 text-amber-300'
  },
  {
    id: 'consumo-psicotropicas',
    number: 4,
    title: '4. AUTOGESTIÓN EN EL CONSUMO NO PROBLEMÁTICO DE SUSTANCIAS PSICOTRÓPICAS',
    shortTitle: '4. Consumo No Problemático de Psicotrópicas',
    tagline: 'Consumo recreativo, contexto, frecuencias y reducción de riesgos sin diagnósticos automáticos.',
    aphorismTitle: 'CONSUMO ≠ PROBLEMA',
    aphorismText: 'El problema lo identifica la persona, no Will.',
    description:
      'Uso de sustancias psicoactivas en contextos recreativos o sociales. Will no asume que todo consumo sea adicción ni impone la abstinencia: aporta datos de farmacología, interacción y reducción de riesgos.',
    bulletPoints: [
      'Diferenciación entre consumo recreativo y consumo problemático',
      'Sustancias: alcohol, cannabis, cocaína, MDMA, estimulantes, disociativos, etc.',
      'Contexto (Set & Setting), pautas de dosificación y frecuencias',
      'El consumo no supone automáticamente un problema ni patología',
      'No diagnóstico, no estigmatización ni etiquetado compulsivo',
      'Información científica sobre riesgos, curvas de efecto y vida media',
      'Decisiones personales y soberanas sobre uso o no uso',
      'Recursos de soporte accesibles si la persona los solicita'
    ],
    themeColor: 'purple',
    badgeBg: 'bg-purple-950/60 border-purple-800/60 text-purple-300'
  },
  {
    id: 'chemsex',
    number: 5,
    title: '5. AUTOGESTIÓN EN LA REDUCCIÓN DE RIESGOS Y DAÑOS DEL CHEMSEX',
    shortTitle: '5. Reducción de Riesgos y Daños del Chemsex',
    tagline: 'Sexo químico: mefedrona, GHB/GBL, interacciones, consentimientos y descansos.',
    aphorismTitle: 'CHEMSEX NO ES SINÓNIMO DE PROBLEMA NI DE SLAM',
    aphorismText: 'Es un contexto específico con identidad propia.',
    description:
      'Uso de sustancias psicoactivas con el propósito de prolongar, facilitar o intensificar encuentros sexuales. Análisis riguroso de riesgos farmacológicos, interacción crítica entre depresores y estimulantes, y señales de alarma.',
    bulletPoints: [
      'Chemsex: sexo + sustancias con el propósito de intensificar/prolongar',
      'No implica automáticamente problema ni requiere sermones paternalistas',
      'Sustancias frecuentes: Mefedrona (4-MMC/3-MMC), GHB/GBL, poppers, etc.',
      'Efectos, farmacocinética, vidas medias e interacciones farmacológicas',
      'Riesgos específicos en contexto sexual: fricción, mucosas, desinhibición',
      'Reducción de riesgos y mitigación de daños (hidratación, descansos, límites)',
      'Posibles daños agudos y detección precoz de señales de alarma (G-out, golpe de calor)',
      'Recursos comunitarios especializados y servicios sanitarios de urgencia',
      'La decisión y el control permanecen siempre en la persona'
    ],
    themeColor: 'rose',
    badgeBg: 'bg-rose-950/60 border-rose-800/60 text-rose-300'
  },
  {
    id: 'slam',
    number: 6,
    title: '6. AUTOGESTIÓN EN LA REDUCCIÓN DE RIESGOS Y DAÑOS DEL SLAM',
    shortTitle: '6. Reducción de Riesgos y Daños del SLAM',
    tagline: 'Uso intravenoso en contexto sexual: riesgos vasculares, material estéril y señales de alarma.',
    aphorismTitle: 'SLAM NO ES SINÓNIMO DE CHEMSEX',
    aphorismText: 'Puede coexistir o existir de forma independiente. Sin instrucciones operativas ni manuales de ejecución.',
    description:
      'Administración intravenosa de sustancias en contexto sexual. Cuenta con identidad técnica propia no subordinada. Enfoque exclusivo en riesgos vasculares, patógenos hemáticos, complicaciones graves y recursos.',
    bulletPoints: [
      'SLAM: uso intravenoso de sustancias en contexto sexual',
      'Identidad técnica propia e independiente (no subordinada a chemsex)',
      'No implica automáticamente que la persona desee abandonar o ser juzgada',
      'Riesgos objetivos: vasculares (flebitis, trombosis, extravasación), infecciosos (VIH, VHC, endocarditis, sepsis), sobredosis aguda',
      'Señales de alarma: punción arterial, dolor torácico, abscesos, fiebre/escalofríos',
      'Reducción de riesgos: información general sobre asepsia y material intransferible',
      'Reducción de daños: mitigación del impacto y detección precoz de daño tisular',
      'Recursos adecuados: PIJ (intercambio de jeringas), salas de consumo supervisado, urgencias 112',
      'Sin instrucciones operativas, recetas de punción ni manuales de ejecución paso a paso'
    ],
    themeColor: 'red',
    badgeBg: 'bg-red-950/60 border-red-800/60 text-red-300'
  }
];

export const SUBSTANCES_DATA: SubstanceInfo[] = [
  // =========================================================================
  // CATEGORÍA 6: REDUCCIÓN DE RIESGOS Y DAÑOS DEL SLAM
  // =========================================================================
  {
    id: 'slam-inyeccion-cuidados',
    name: 'SLAM (Uso Intravenoso en Contexto Sexual)',
    domainId: 'slam',
    category: '6. Reducción de Riesgos y Daños del SLAM',
    summary: 'Administración intravenosa de sustancias estimulantes (tina/metanfetamina, mefedrona) en sesiones sexuales.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Vía intravenosa'],
    soughtEffects: [
      'Aparición instantánea de efectos estimulantes y entactógenos (flash/rush)',
      'Intensificación sensorial y desinhibición sexual extrema',
      'Incremento de la energía física y alteración de la percepción temporal'
    ],
    pharmacology:
      'La vía intravenosa introduce la sustancia directamente en el torrente circulatorio con una biodisponibilidad del 100% y un inicio de acción en segundos. Provoca un estímulo cardiovascular y neuroquímico de máxima intensidad sin el filtrado de la absorción gástrica o mucosa.',
    objectiveRisksAndInteractions: [
      'Riesgo vascular: colapso venoso, esclerosis de vasos periféricos, flebitis (inflamación venosa), tromboflebitis y extravasación tisular.',
      'Riesgos específicos por zona anatómica: mayor fragilidad venosa, flujo de retorno más lento y alto riesgo de trombosis/infección en extremidades inferiores (pies, tobillos) o zonas críticas (cuello, ingles, manos).',
      'Riesgo infeccioso hemático: transmisión de patógenos de transmisión sanguínea (VHC / Hepatitis C, VIH, VHB) si se comparte cualquier elemento (agujas, jeringas, filtros, cazoletas, agua).',
      'Riesgo bacteriano y sistémico: celulitis, abscesos profundos, bacteriemia, sepsis y endocarditis bacteriana (infección de las válvulas cardíacas) si entran bacterias cutáneas o ambientales en el torrente circulatorio.',
      'Riesgo de punción accidental de arterias o afectación de nervios periféricos.',
      'Sobredosis aguda por entrada instantánea del fármaco sin posibilidad de frenar la absorción.'
    ],
    criticalInteractions: [
      'Combinación con otros estimulantes: sobrecarga cardiovascular extrema, vasoespasmo y arritmias mortales.',
      'Uso simultáneo con depresores (GHB/GBL, alcohol, ketamina): enmascaramiento de la depresión respiratoria cuando decae el estimulante.'
    ],
    harmReductionFacts: [
      'Principio de material estéril intransferible: utilización de material 100% nuevo, estéril y de un solo uso para cada intento (jeringas, agujas, cazoletas, filtros de membrana y agua para inyección).',
      'Asepsia cutánea: lavado de manos con agua y jabón; desinfección de la zona de punción con toallita alcohólica antes de cualquier intento.',
      'Rotación sistemática de venas para permitir la recuperación tisular y evitar la esclerosis o colapso venoso.',
      'Preservación de la integridad venosa: no insistir en venas dañadas, inflamadas o con hematomas visibles.',
      'Desecho seguro: eliminación de agujas y material punzante en contenedores rígidos de bioseguridad para prevenir accidentes biológicos.',
      'Cero compartición: nunca compartir filtros, cazoletas ni líquidos de disolución (el VHC resiste semanas en microgotas).'
    ],
    warningSigns: [
      'Punción arterial: salida de sangre roja brillante pulsátil a presión y dolor agudo urente (retirar inmediatamente, presionar con firmeza constante durante al menos 10-15 minutos y acudir a urgencias).',
      'Signos de infección local o absceso: zona caliente, enrojecida, hinchada, endurecida o supurante con dolor pulsátil.',
      'Signos de alarma sistémica: fiebre, escalofríos, malestar general, dolor torácico, disnea o taquicardia sostenida (requieren valoración médica inmediata para descartar sepsis o endocarditis).',
      'Pérdida de sensibilidad motora o adormecimiento persistente en extremidades.'
    ],
    knownUncertainties: [
      'Variabilidad extrema de pureza, acidez (pH) y adulterantes insolubles en muestras no reguladas, los cuales pueden causar microembolias o quemaduras químicas en el endotelio vascular.',
      'Impacto acumulativo de la vasoconstricción aguda repetida sobre la microvasculatura periférica.'
    ],
    categorizedResources: [
      {
        name: 'Teléfono de Emergencias 112 / Urgencias Hospitalarias',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Atención médica prioritaria ante sospecha de punción arterial, sepsis, endocarditis o sobredosis aguda.',
        contact: '112 (España / UE)'
      },
      {
        name: 'Unidades de Enfermedades Infecciosas & Hospital Clínic de Barcelona',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Tratamiento de complicaciones vasculares complejas, valoración de endocarditis y tratamiento del VHC / VIH.',
        contact: 'Atención Hospitalaria y Primaria'
      },
      {
        name: 'Programas de Intercambio de Jeringas (PIJ) & Salas de Consumo Supervisado',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Acceso a kits estériles de inyección, contenedores de bioseguridad, filtros de membrana y pruebas rápidas de VHC.',
        contact: 'Centros Comunitarios gtt-VIH / Stop / Imagina MÁS / CAS'
      }
    ],
    sources: [
      'gtt-VIH.org (Guías especializadas de SLAM y salud vascular)',
      'Energy Control (Informes técnicos de reducción de daños)',
      'Hospital Clínic de Barcelona (Servicio de Enfermedades Infecciosas)',
      'Plan Nacional sobre Drogas (Ministerio de Sanidad)',
      'Organización Mundial de la Salud (OMS / WHO)'
    ],
    keyConsiderations: [
      'El SLAM tiene identidad técnica propia e irrepetible; no es un mero subtipo de chemsex.',
      'La información técnica permite comprender riesgos y complicaciones sin constituir instrucciones de ejecución.'
    ]
  },

  // =========================================================================
  // CATEGORÍA 5: REDUCCIÓN DE RIESGOS Y DAÑOS DEL CHEMSEX
  // =========================================================================
  {
    id: 'mefedrona',
    name: 'Mefedrona (4-MMC / Miaw)',
    domainId: 'chemsex',
    category: '5. Reducción de Riesgos y Daños del Chemsex',
    summary: 'Catinona sintética estimulante y entactógena de corta duración con marcado impulso de redosificación.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Vía nasal (esnifada)', 'Vía oral (bombeo / cápsula)', 'Vía rectal (booty bumping)'],
    soughtEffects: [
      'Euforia intensa y empatía / conexión emocional (entactógeno)',
      'Desinhibición sexual acusada y mayor sensibilidad táctil',
      'Aumento de la energía y estimulación motora'
    ],
    pharmacology:
      'Inhibe la recaptación y estimula la liberación masiva de dopamina y serotonina. Inicio rápido por vía nasal (2-5 min) u oral (15-45 min). Vida media corta (1.5 - 2.5 h) con rápido descenso plasmático que suele desencadenar craving agudo.',
    objectiveRisksAndInteractions: [
      'Vasoconstricción periférica, taquicardia severa, hipertensión arterial y aumento de temperatura corporal.',
      'Riesgo de síndrome serotoninérgico severo si se combina con antidepresivos IMAO o ISRS, MDMA o tramadol.',
      'Irritación y daño químico en mucosas (erosión de tabique nasal o mucosa rectal).',
      'Paranoia, ansiedad aguda y psicosis tóxica transitoria tras periodos prolongados sin descanso o sueño.'
    ],
    criticalInteractions: [
      'IMAOs e ISRS: riesgo crítico de toxicidad por serotonina.',
      'Otros estimulantes (cocaína, metanfetamina): sobrecarga miocárdica extrema.',
      'Viagra / Levitra / Cialis: riesgo hemodinámico cardiovascular añadido.'
    ],
    harmReductionFacts: [
      'Información sobre vidas medias y espaciamiento voluntario si la persona desea pautar límites propios.',
      'Protección de mucosas: uso de tubos individuales limpios para vía nasal; lavados con suero fisiológico.',
      'En vía rectal (booty bumping): lubricación abundante, disolución completa en agua estéril sin aguja y protección de la mucosa.',
      'Uso abundante de lubricante a base de agua/silicona y preservativo en relaciones sexuales para mitigar microlesiones anales.',
      'Hidratación equilibrada con sales minerales (evitar el consumo masivo de agua sola para no provocar hiponatremia).'
    ],
    warningSigns: [
      'Dolor torácico opresivo, dificultad respiratoria o palpitaciones descontroladas.',
      'Hipertermia severa con piel seca y caliente, rigidez muscular o confusión (sospecha de síndrome serotoninérgico o golpe de calor).',
      'Desorientación profunda o crisis de pánico incontrolable.'
    ],
    knownUncertainties: [
      'Gran variabilidad de pureza y presencia frecuente de análogos sintéticos (3-MMC, CMC, clefedrona) en el mercado no regulado.',
      'Efectos a largo plazo sobre los transportadores serotoninérgicos y la función valvular cardíaca.'
    ],
    categorizedResources: [
      {
        name: 'Urgencias 112',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Atención inmediata ante dolor en el pecho, arritmias severas o hipertermia aguda.',
        contact: '112'
      },
      {
        name: 'Centros de Atención y Seguimiento a las Drogodependencias (CAS) / Salud Mental',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Atención psicológica y médica pública ante malestar emocional o deseo de modulación de consumo.',
        contact: 'Red Sanitaria Pública'
      },
      {
        name: 'Energy Control & Checkpoints de Chemsex',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Servicio de análisis de sustancias no reguladas, asesoramiento entre iguales y pruebas de salud sexual.',
        contact: 'energycontrol.org / stop-sida.org / bcncheckpoint'
      }
    ],
    sources: [
      'Energy Control',
      'gtt-VIH.org',
      'CESIDA (Infodrogas)',
      'Hospital Clínic de Barcelona',
      'ECDC (European Centre for Disease Prevention and Control)'
    ],
    keyConsiderations: [
      'El consentimiento explícito y continuo requiere atención activa ante la intensa desinhibición química.'
    ]
  },
  {
    id: 'ghb-gbl',
    name: 'GHB / GBL (Éxtasis líquido / Chorri)',
    domainId: 'chemsex',
    category: '5. Reducción de Riesgos y Daños del Chemsex',
    summary: 'Depresor del sistema nervioso central con margen de seguridad (ventana dosis-efecto/toxicidad) sumamente estrecho.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Vía oral (disuelto en líquido no alcohólico)'],
    soughtEffects: [
      'Desinhibición, relajación muscular y euforia suave',
      'Sensación de ligereza, incremento del deseo y sociabilidad',
      'Efecto afrodisíaco en dosis bajas'
    ],
    pharmacology:
      'Agonista de los receptores GHB y GABAB en el cerebro. El GBL (gamma-butirolactona) es un profármaco que se transforma rápidamente en GHB mediante las lactonasas plasmáticas. Inicio a los 10-20 min, pico a los 30-45 min, duración 1.5 - 3 horas.',
    objectiveRisksAndInteractions: [
      'Margen de seguridad sumamente estrecho: la diferencia entre la dosis deseada y la dosis tóxica es mínima.',
      'Sinergia depresora potencialmente letal al combinarse con alcohol, benzodiacepinas, ketamina u opiáceos (riesgo extremo de parada respiratoria y coma / G-out).',
      'Pérdida súbita de consciencia con abolición del reflejo nauseoso (riesgo de asfixia por vómito si la persona está tumbada boca arriba).',
      'Desarrollo de dependencia física rápida con uso continuado cada pocas horas, con síndrome de abstinencia severo que requiere supervisión médica hospitalaria.'
    ],
    criticalInteractions: [
      'Alcohol: CONTRAINDICACIÓN CRÍTICA. Multiplica exponencialmente el riesgo de depresión respiratoria y muerte accidental.',
      'Ketamina, benzodiacepinas y opioides: riesgo sinérgico de colapso respiratorio.',
      'Inhibidores de proteasa (ciertos antirretrovirales para el VIH): pueden alterar su metabolismo.'
    ],
    harmReductionFacts: [
      'Reconocimiento de la estrecha ventana de seguridad y variabilidad de concentración entre partidas.',
      'El GBL es corrosivo para las mucosas digestivas y requiere dilución en abundante líquido no alcohólico.',
      'Tiempo de eliminación: considerar que redosificar antes de la eliminación completa de la toma previa acumula niveles plasmáticos tóxicos.',
      'Cero mezcla con alcohol u otros depresores del sistema nervioso.',
      'Saber colocar a una persona inconsciente en Posición Lateral de Seguridad (PLS) y no dejarla nunca sola.'
    ],
    warningSigns: [
      'Coma inducido (G-out): persona que no responde a estímulos verbales ni físicos, respiración lenta (menos de 8-10 respiraciones por minuto) o ruidosa/ronquidos profundos.',
      'Vómitos en estado de inconsciencia (riesgo de aspiración bronquial).',
      'Labios o uñas azuladas (cianosis por falta de oxígeno).'
    ],
    knownUncertainties: [
      'Diferencias cinéticas entre GHB, GBL y 1,4-butanediol (1,4-BD) que dificultan la previsión de tiempos.',
      'Factores enzimáticos individuales en la tasa de metabolización.'
    ],
    categorizedResources: [
      {
        name: 'Urgencias Médicas 112 (Código G-Out)',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Llamada urgente inmediata ante inconsciencia, respiración irregular o sospecha de sobredosis.',
        contact: '112'
      },
      {
        name: 'Servicios de Toxicología Clínica Hospitalaria',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Unidades de desintoxicación hospitalaria supervisada para abstinencia física de GHB.',
        contact: 'Atención Especializada'
      },
      {
        name: 'Recursos Comunitarios de Reducción de Daños en Chemsex',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Dosificadores graduados, talleres de Posición Lateral de Seguridad (PLS) y soporte no enjuiciador.',
        contact: 'Stop / Imagina MÁS / BCN Checkpoint'
      }
    ],
    sources: [
      'Energy Control',
      'Hospital Clínic de Barcelona (Servicio de Urgencias y Toxicología)',
      'gtt-VIH.org',
      'Plan Nacional sobre Drogas'
    ],
    keyConsiderations: [
      'Ante una persona inconsciente que no responde o respira con dificultad, la prioridad médica es la llamada al 112 y la Posición Lateral de Seguridad.'
    ]
  },

  // =========================================================================
  // CATEGORÍA 4: AUTOGESTIÓN EN EL CONSUMO NO PROBLEMÁTICO DE PSICOTRÓPICAS
  // =========================================================================
  {
    id: 'tina-metanfetamina',
    name: 'Metanfetamina (Tina / Crystal Meth)',
    domainId: 'consumo-psicotropicas',
    category: '4. Consumo No Problemático de Psicotrópicas',
    summary: 'Estimulante sintético de alta potencia y duración prolongada con fuerte afinidad dopaminérgica.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Vía fumada (pipa de pyrex)', 'Vía inhalada (esnifada)', 'Vía oral', 'Vía rectal (booty bump)'],
    soughtEffects: [
      'Alerta extrema, incremento de energía y vigilia durante horas prolongadas',
      'Intensa euforia inicial y supresión del cansancio, sueño y apetito',
      'Focalización intensa y desinhibición'
    ],
    pharmacology:
      'Provoca la liberación masiva de dopamina, noradrenalina y serotonina, al tiempo que bloquea su recaptación. Vida media muy larga (9 a 12 horas en plasma; efectos clínicos de 8 a 24 horas según la vía de administración).',
    objectiveRisksAndInteractions: [
      'Hipertermia severa, crisis hipertensivas, taquiarritmias y vasoespasmo coronario.',
      'Psicosis tóxica inducida por anfetaminas (paranoia, delirios de persecución, alucinaciones) frecuentemente precipitada por la privación prolongada de sueño (>24-48 horas).',
      'Desgaste físico acusado, bruxismo severo y sequedad extrema de mucosas.',
      'Riesgo de transmisión de patógenos por vía hemática si se comparte parafernalia de cualquier tipo (pipas con quemaduras en labios, tubos).'
    ],
    criticalInteractions: [
      'Otros estimulantes (cocaína, mefedrona): sobrecarga cardíaca crítica.',
      'IMAOs: crisis hipertensiva potencialmente fatal.',
      'Fármacos vasodilatadores / poppers: inestabilidad hemodinámica severa.'
    ],
    harmReductionFacts: [
      'Planificar la hidratación y el aporte de calorías y nutrientes asimilables (fruta, batidos, caldos) durante periodos prolongados.',
      'Material de uso individual: tubos limpios para vía nasal; pipas de vidrio pyrex individuales con protector labial para evitar quemaduras y transmisión viral.',
      'Para vía intravenosa, consultar la categoría específica e independiente de SLAM.',
      'Uso generoso de lubricante y preservativos de materiales compatibles en relaciones sexuales para evitar lesiones por fricción prolongada.',
      'Tener presentes los efectos de la privación de sueño sobre la percepción y el juicio crítico.'
    ],
    warningSigns: [
      'Dolor punzante u opresivo en el pecho que se irradia al brazo o mandíbula.',
      'Temperatura corporal peligrosamente elevada sin sudoración.',
      'Episodios paranoides severos o agitación extrema con pérdida de contacto con la realidad.'
    ],
    knownUncertainties: [
      'Variabilidad en la pureza del cristal y presencia de subproductos de síntesis o análogos sintéticos.',
      'Efectos a largo plazo sobre los receptores dopaminérgicos y la plasticidad sináptica.'
    ],
    categorizedResources: [
      {
        name: 'Urgencias 112',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Atención urgente ante dolor precordial o hipertermia severa.',
        contact: '112'
      },
      {
        name: 'Centros de Atención a las Drogodependencias y Salud Mental (CAS)',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Acompañamiento especializado ambulatorio o residencial si la persona desea realizar cambios en su consumo.',
        contact: 'Red Sanitaria Pública'
      },
      {
        name: 'Energy Control (Servicio de Análisis y Asesoramiento)',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Análisis de composición química, pipas individuales y orientación técnica sin estigma.',
        contact: 'energycontrol.org'
      }
    ],
    sources: [
      'Energy Control',
      'Plan Nacional sobre Drogas',
      'OMS (WHO - Guidelines on Stimulant Use)',
      'ECDC'
    ],
    keyConsiderations: [
      'La duración prolongada de la sustancia requiere considerar los tiempos necesarios para la recuperación física y mental.'
    ]
  },
  {
    id: 'ketamina',
    name: 'Ketamina (Keta / Especial K)',
    domainId: 'consumo-psicotropicas',
    category: '4. Consumo No Problemático de Psicotrópicas',
    summary: 'Anestésico disociativo antagonista de los receptores NMDA.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Vía inhalada (esnifada)', 'Vía oral', 'Vía intramuscular'],
    soughtEffects: [
      'En dosis bajas: desinhibición, relajación corporal, euforia y leve alteración sensorial',
      'En dosis medias: disociación corporal, ensoñación y distorsión espacio-temporal',
      'En dosis altas: disociación profunda del cuerpo y la mente (K-hole / agujero de keta)'
    ],
    pharmacology:
      'Bloquea los receptores glutamatérgicos NMDA, interrumpiendo las señales entre el córtex cerebral y el sistema límbico. Provoca analgesia profunda y separación mente-cuerpo.',
    objectiveRisksAndInteractions: [
      'Pérdida total de la coordinación motora, caídas, quemaduras o traumatismos en estados disociativos.',
      'Supresión de la percepción de dolor: riesgo de lesiones inadvertidas durante relaciones sexuales o juegos intensos.',
      'Sinergia depresora severa al combinarse con alcohol, GHB/GBL u opioides (riesgo crítico de depresión respiratoria y broncoaspiración).',
      'Cistitis ulcerativa por ketamina: daño crónico en el epitelio vesical por uso continuado y frecuente.'
    ],
    criticalInteractions: [
      'Alcohol y GHB/GBL: riesgo de pérdida de consciencia y asfixia por vómito.',
      'Depresores del SNC: potenciación de la depresión respiratoria.'
    ],
    harmReductionFacts: [
      'Picar el polvo de forma muy fina para mitigar el daño mecánico en la mucosa nasal.',
      'Ubicarse en un entorno seguro y permanecer sentado o tumbado para evitar caídas.',
      'Evitar comer en las 2 horas previas para reducir el riesgo de náuseas o broncoaspiración.',
      'Espaciar los días de consumo y mantenerse hidratado para proteger las vías urinarias.',
      'Tener en cuenta la pérdida de sensibilidad al dolor durante la actividad física o sexual.'
    ],
    warningSigns: [
      'Dolor pélvico persistente, necesidad frecuente de orinar o sangre en orina (síntomas de cistitis por ketamina).',
      'Pérdida de consciencia en combinación con otros depresores.',
      'Vómitos en personas que no pueden incorporarse.'
    ],
    knownUncertainties: [
      'Tolerancia cruzada y diferencias farmacocinéticas entre enantiómeros (S-ketamina vs R-ketamina).'
    ],
    categorizedResources: [
      {
        name: 'Urgencias 112',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Atención urgente ante asfixia por vómito, traumatismos graves o pérdida de consciencia prolongada.',
        contact: '112'
      },
      {
        name: 'Servicios de Urología y Atención Primaria',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Diagnóstico precoz y tratamiento de la cistitis intersticial inducida por ketamina.',
        contact: 'Centros de Salud Públicos'
      },
      {
        name: 'Energy Control',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Información de dosificación, análisis de adulterantes y tubos individuales para esnifar.',
        contact: 'energycontrol.org'
      }
    ],
    sources: [
      'Energy Control',
      'Hospital Clínic de Barcelona',
      'Plan Nacional sobre Drogas'
    ],
    keyConsiderations: [
      'La analgesia inducida enmascara microlesiones o traumatismos que requieren atención posterior.'
    ]
  },

  // =========================================================================
  // CATEGORÍA 2: AUTOGESTIÓN DE LA SALUD SEXUAL
  // =========================================================================
  {
    id: 'prep-pep-salud-sexual',
    name: 'PrEP & PEP (Profilaxis Pre y Post Exposición)',
    domainId: 'salud-sexual',
    category: '2. Autogestión de la Salud Sexual',
    summary: 'Estrategias biomédicas de prevención altamente eficaces contra la transmisión del VIH.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Vía oral (comprimidos antirretrovirales)'],
    soughtEffects: [
      'Prevención biomédica de la transmisión del VIH',
      'Tranquilidad y autonomía en la vivencia de la sexualidad'
    ],
    pharmacology:
      'Combinación de antirretrovirales (Tenofovir disoproxilo / Emtricitabina) que impiden la replicación y establecimiento del VIH en el organismo si entra en contacto con el torrente sanguíneo.',
    objectiveRisksAndInteractions: [
      'La PrEP protege con altísima eficacia frente al VIH, pero no previene otras ITS (sífilis, gonorrea, clamidia, VHC, VPH, mpox).',
      'La PEP (profilaxis post-exposición) es un tratamiento de urgencia que debe iniciarse preferiblemente en las primeras 24 horas (máximo 72 horas) y completarse durante 28 días.',
      'Requiere monitoreo periódico de la función renal (creatinina y aclaramiento renal).'
    ],
    criticalInteractions: [
      'Fármacos o suplementos con toxicidad renal simultánea.',
      'Interrupciones no planificadas de la pauta que comprometan los niveles de protección en sangre y tejidos.'
    ],
    harmReductionFacts: [
      'PrEP diaria: una pastilla diaria continuada (alcanza máxima eficacia en relaciones anales tras 7 días de inicio).',
      'PrEP a demanda (esquema 2-1-1): 2 pastillas de 2 a 24 horas antes de la relación sexual, 1 pastilla 24 horas después de la primera toma, y 1 pastilla 48 horas después (validado específicamente para relaciones anales en hombres cis y personas asignadas masculino al nacer).',
      'Cribado periódico de ITS cada 3 meses en centros de salud sexual o Checkpoints.',
      'Vacunación completa recomendada frente a Hepatitis A (VHA), Hepatitis B (VHB), VPH y Mpox.',
      'Conocimiento de I=I: Indetectable = Intransmisible (una persona con VIH con carga viral indetectable durante más de 6 meses no transmite el virus por vía sexual).'
    ],
    warningSigns: [
      'Aparición de fiebre, exantema o llagas en las semanas posteriores a una práctica sin protección (posible síndrome retroviral agudo o ITS sintomática).',
      'Demora mayor a 72 horas para solicitar PEP tras una exposición de riesgo.'
    ],
    knownUncertainties: [
      'Efectos a muy largo plazo sobre la densidad mineral ósea en tratamientos continuados de muchas décadas.'
    ],
    categorizedResources: [
      {
        name: 'Servicios de Urgencias Hospitalarias (Inicio de PEP Urgente 24/7)',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Acceso urgente inmediato para iniciar PEP en las primeras 24-72 horas tras una práctica de riesgo.',
        contact: 'Urgencias Hospitalarias'
      },
      {
        name: 'Unidades de Enfermedades Infecciosas / VIH & Centros de ITS',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Prescripción y seguimiento público de PrEP, analíticas de función renal y serologías.',
        contact: 'Centros de Salud y Hospitales Públicos'
      },
      {
        name: 'Checkpoints Comunitarios de Salud Sexual (BCN Checkpoint / Stop / Centro Sandoval / CESIDA)',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Cribados rápidos y gratuitos de VIH, VHC, sífilis, clamidia y gonorrea entre iguales, sin estigma.',
        contact: 'gtt-vih.org / bcncheckpoint / cesida.org'
      }
    ],
    sources: [
      'gtt-VIH.org',
      'CESIDA',
      'Ministerio de Sanidad (Guía oficial de PrEP / PEP)',
      'Hospital Clínic de Barcelona',
      'ONUSIDA (UNAIDS) / OMS'
    ],
    keyConsiderations: [
      'La información biomédica se presenta para facilitar la toma de decisiones autónomas sin imponer modelos de conducta.'
    ]
  },
  {
    id: 'its-cribado-sintomas-tratamiento',
    name: 'ITS (Infecciones de Transmisión Sexual: Infección vs Enfermedad)',
    domainId: 'salud-sexual',
    category: '2. Autogestión de la Salud Sexual',
    summary: 'Identificación, asintomatología, cribados periódicos multizona y abordaje sin estigma de ITS bacterianas y virales.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Transmisión por mucosas anal, oral, genital o contacto hemático/cutáneo'],
    soughtEffects: [
      'Detección precoz y tratamiento oportuno de infecciones',
      'Prevención de complicaciones a medio y largo plazo',
      'Cuidado integral y bienestar sexual informado'
    ],
    pharmacology:
      'Las ITS engloban patógenos bacterianos (Treponema pallidum / sífilis, Neisseria gonorrhoeae / gonorrea, Chlamydia trachomatis / clamidia y LGV, Mycoplasma genitalium), virales (VIH, VHC, VHB, VHA, Herpes simple VHS-1/2, VPH, Mpox) y parasitarios.',
    objectiveRisksAndInteractions: [
      'Alta tasa de asintomatología: muchas ITS en recto y faringe (especialmente gonorrea, clamidia y sífilis en fases iniciales) no producen dolor ni secreción visible pero pueden transmitirse y causar daño tisular.',
      'Diferenciación conceptual: una "infección" es la presencia biológica del microorganismo; una "enfermedad" aparece cuando genera daño tisular sintomático o sistémico.',
      'Riesgo de resistencia a antibióticos: la automedicación o uso empírico sin frotis favorece cepas multirresistentes de gonococo y Mycoplasma.',
      'Sinergia lesional: las úlceras o inflamación mucosa facilitan la entrada de otros patógenos como el VIH o el VHC.',
      'Complicaciones no tratadas: linfogranuloma venéreo (LGV), enfermedad pélvica inflamatoria, estenosis uretrales o afectación neurológica/cardíaca tardía en sífilis.'
    ],
    criticalInteractions: [
      'Automedicación con antibióticos sobrantes sin frotis ni antibiograma previo: genera resistencias y tratamientos fallidos.',
      'Relaciones sexuales sin barrera durante el periodo de tratamiento activo antes de la confirmación de curación.'
    ],
    harmReductionFacts: [
      'Cribado periódico trimestral o semestral multizona (faringe, uretra/orina, recto y analítica serológica de sangre para sífilis, VIH, VHB y VHC).',
      'Completar siempre la pauta antibiótica prescrita por profesionales sanitarios de principio a fin.',
      'Avisar a parejas sexuales recientes ante un diagnóstico para que puedan acceder a pruebas y tratamiento oportuno (notificación de contactos).',
      'Uso de barreras y lubricantes compatibles para mitigar microabrasiones en mucosas.',
      'Vacunación completa frente a VHA, VHB, VPH y Mpox en centros de salud sexual o Checkpoints.'
    ],
    warningSigns: [
      'Aparición de úlceras, llagas o chancros indoloros o dolorosos en genitales, ano o boca.',
      'Secreción purulenta o mucosa uretral, rectal o faríngea acompañada o no de ardor al orinar.',
      'Erupciones en la piel (exantemas que pueden incluir palmas de manos y plantas de pies en sífilis secundaria).',
      'Inflamación dolorosa de ganglios inguinales (adenopatías).'
    ],
    knownUncertainties: [
      'Periodos ventana variables según el tipo de prueba diagnóstica (serología vs PCR/NAAT).',
      'Aparición de nuevas variantes con menor sensibilidad a tratamientos convencionales de primera línea.'
    ],
    categorizedResources: [
      {
        name: 'Centros de ITS de Urgencia / Atención Especializada',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Atención rápida ante úlceras dolorosas sangrantes, retención aguda de orina o linfadenopatía supurada.',
        contact: 'Centro Sandoval (Madrid) / Centros de ITS Hospitalarios'
      },
      {
        name: 'Atención Primaria y Unidades de Dermatología / Infecciosas',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Toma de frotis, PCR/NAAT, antibiograma y prescripción de tratamientos antibióticos dirigidos.',
        contact: 'Centros de Salud'
      },
      {
        name: 'Checkpoints Comunitarios de Salud Sexual',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Pruebas rápidas no invasivas, asesoramiento confidencial, material preventivo y acompañamiento entre pares.',
        contact: 'BCN Checkpoint / Stop / Imagina MÁS / CESIDA'
      }
    ],
    sources: [
      'gtt-VIH.org',
      'CESIDA',
      'Centro Sandoval (Madrid) / BCN Checkpoint',
      'CDC (STI Treatment Guidelines)',
      'ECDC (European Centre for Disease Prevention and Control)',
      'Organización Mundial de la Salud (OMS / WHO)'
    ],
    keyConsiderations: [
      'Tener una ITS es una circunstancia de salud común tratable, desprovista de connotaciones morales o estigma.',
      'El cribado rutinario multizona es la herramienta principal para la salud individual y comunitaria.'
    ]
  },
  {
    id: 'poppers',
    name: 'Nitritos de Alquilo (Poppers)',
    domainId: 'salud-sexual',
    category: '2. Autogestión de la Salud Sexual',
    summary: 'Inhalantes vasodilatadores de acción inmediata y relajación de la musculatura lisa.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Vía inhalada'],
    soughtEffects: [
      'Relajación rápida de esfínteres y musculatura lisa',
      'Sensación súbita de calor y euforia breve (1-3 minutos)',
      'Intensificación de sensaciones eróticas'
    ],
    pharmacology:
      'Liberan óxido nítrico en el endotelio vascular provocando relajación inmediata de la musculatura lisa y vasodilatación periférica masiva con caída abrupta de la presión arterial y taquicardia refleja.',
    objectiveRisksAndInteractions: [
      'CONTRAINDICACIÓN ABSOLUTA: Combinación con inhibidores de la PDE-5 (Viagra/sildenafilo, Cialis/tadalafilo, Levitra/vardenafilo). Puede desencadenar un colapso cardiovascular irreversible por hipotensión fulminante y muerte.',
      'Metahemoglobinemia por uso masivo o continuado (incapacidad de la sangre para transportar oxígeno).',
      'Irritación química y quemaduras en piel y mucosas si el líquido entra en contacto directo.',
      'Peligro de inflamabilidad alta ante llamas o fuentes de ignición.'
    ],
    criticalInteractions: [
      'Inhibidores de la PDE-5 (medicamentos para la erección): incompatibilidad fatal.',
      'Otros fármacos hipotensores o vasodilatadores.'
    ],
    harmReductionFacts: [
      'Nunca beber el líquido bajo ninguna circunstancia (es un tóxico mortal por ingestión).',
      'Si se utilizan medicamentos para la erección, esperar el tiempo de eliminación completo antes de considerar el uso de poppers.',
      'Mantener los frascos alejados de llamas, velas o cigarrillos.',
      'Sentarse o tumbarse si surge mareo para prevenir caídas por bajada brusca de tensión.',
      'Ventilar el espacio si se utiliza en habitaciones cerradas.'
    ],
    warningSigns: [
      'Piel, labios o uñas azuladas o grisáceas acompañadas de mareo severo o confusión (sospecha de metahemoglobinemia).',
      'Desmayo o pérdida súbita de consciencia por hipotensión severa.',
      'Contacto accidental del líquido con los ojos o ingestión oral (acudir a urgencias inmediatamente).'
    ],
    knownUncertainties: [
      'Riesgo de maculopatía / daño retiniano asociado al nitrito de isopropilo frente a otras variantes como el nitrito de amilo o pentilo.'
    ],
    categorizedResources: [
      {
        name: 'Urgencias 112',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Atención urgente inmediata ante desmayo con hipotensión severa o sospecha de metahemoglobinemia.',
        contact: '112'
      },
      {
        name: 'Servicio de Información Toxicológica (SIT)',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Información médica toxicológica ante contacto accidental con mucosas o ingesta.',
        contact: '+34 91 562 04 20'
      },
      {
        name: 'Energy Control',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Información técnica de composición química y reducción de riesgos cardiovasculares.',
        contact: 'energycontrol.org'
      }
    ],
    sources: [
      'Energy Control',
      'Hospital Clínic de Barcelona',
      'gtt-VIH.org',
      'Plan Nacional sobre Drogas'
    ],
    keyConsiderations: [
      'Conocer la incompatibilidad absoluta con fármacos de la erección es fundamental para la seguridad cardiovascular.'
    ]
  },

  // =========================================================================
  // CATEGORÍA 3: AUTOGESTIÓN DEL PLACER SEXUAL
  // =========================================================================
  {
    id: 'gestion-placer-consentimiento',
    name: 'Gestión del Placer, Deseo y Consentimiento Dinámico',
    domainId: 'placer-sexual',
    category: '3. Autogestión del Placer Sexual',
    summary: 'Exploración de la sexualidad consciente, acuerdos entre personas, soberanía del goce y comunicación de límites.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Dimensión afectiva, relacional y sensorial'],
    soughtEffects: [
      'Exploración erótica libre de estigma y moralina',
      'Bienestar emocional, placer compartido o individual y disfrute pleno',
      'Profundización en prácticas diversas (BDSM, fisting, juego grupal, kink)'
    ],
    pharmacology:
      'La respuesta sexual involucra neurotransmisores dopaminérgicos (deseo), oxitocinérgicos (apego/confianza) y endorfinérgicos (placer y analgesia). La modulación por sustancias psicoactivas altera la percepción subjetiva de los límites y el dolor.',
    objectiveRisksAndInteractions: [
      'Asunción de consentimiento tácito o retroactivo bajo efectos de sustancias.',
      'Disociación entre el deseo genuino propio y la expectativa del grupo o entorno.',
      'Lesiones tisulares por disminución del umbral de dolor bajo analgesia química (p. ej. ketamina, GHB).'
    ],
    criticalInteractions: [
      'Sustancias disociativas/depresoras en prácticas de impacto o penetración profunda sin monitoreo de dolor fisiológico.'
    ],
    harmReductionFacts: [
      'Consentimiento continuo y dinámico: el consentimiento es específico, informado y puede ser modificado o retirado en cualquier momento.',
      'Establecimiento previo de acuerdos, límites y palabras de seguridad (safewords) o señales gestuales claras.',
      'Reconocimiento pleno del derecho a pausar, cambiar de rol o abandonar una interacción sin dar explicaciones ni sufrir presiones.',
      'Uso de guantes de nitrilo, lubricante específico y material higiénico en prácticas de juego anal profundo (fisting).'
    ],
    warningSigns: [
      'Presión psicológica o manipulación para traspasar límites previamente acordados.',
      'Dolor agudo inesperado, sangrado activo o pérdida de movilidad tras una práctica.',
      'Incapacidad manifiesta de una persona para comunicarse o expresar su voluntad debido al estado de intoxicación.'
    ],
    knownUncertainties: [
      'Variabilidad individual en la vivencia del placer y la introspección emocional durante estados alterados de consciencia.'
    ],
    categorizedResources: [
      {
        name: 'Servicios de Urgencias Médicas',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Atención urgente ante desgarros tisulares, hemorragias o traumatismos en prácticas eróticas intensas.',
        contact: '112'
      },
      {
        name: 'Consultas de Sexología y Psicología Afirmativa',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Atención sexológica pública y privada para el abordaje de disfunciones eróticas o malestar vincular.',
        contact: 'Red Sanitaria y Colegios Profesionales'
      },
      {
        name: 'Talleres Comunitarios de Erotismo Consciente y Consentimiento',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Espacios comunitarios de aprendizaje entre iguales sobre prácticas BDSM seguras, fisting y comunicación erótica.',
        contact: 'Imagina MÁS / Stop / CESIDA'
      }
    ],
    sources: [
      'Imagina MÁS',
      'Stop (Barcelona)',
      'CESIDA',
      'World Association for Sexual Health (WAS)'
    ],
    keyConsiderations: [
      'El placer y el erotismo son dimensiones legítimas del bienestar humano; Will no moraliza las preferencias ni las orientaciones.'
    ]
  },
  {
    id: 'diversidad-sexual-relacional',
    name: 'Diversidad Sexual, Relacional y Expresión de Género',
    domainId: 'placer-sexual',
    category: '3. Autogestión del Placer Sexual',
    summary: 'Acompañamiento afirmativo en identidades disidentes, no monogamias éticas, dinámicas comunitarias y visibilidad.',
    epistemicStatus: 'VERIFICADO',
    adminRoutes: ['Dimensión afectiva, psicosocial y comunitaria'],
    soughtEffects: [
      'Validación de la propia identidad y formas relacionales',
      'Autonomía en acuerdos afectivos y de cuidados',
      'Desarrollo de redes de apoyo afirmativas libres de discriminación'
    ],
    pharmacology:
      'Dimensión psicosocial y afectiva libre de patologización médica o juicio moral.',
    objectiveRisksAndInteractions: [
      'Estrés de minorías y discriminación estructural que pueden impactar en el bienestar psicológico.',
      'Conflictos de comunicación en modelos no monogámicos si faltan acuerdos explícitos y honestidad afectiva.',
      'Invisibilización de identidades trans, no binarias o expresiones de género diversas.'
    ],
    criticalInteractions: [
      'Entornos estigmatizantes o patologizadores que condicionan la salud mental y el autocuidado.'
    ],
    harmReductionFacts: [
      'Reconocimiento afirmativo de todas las orientaciones e identidades sin esquemas normativos.',
      'Comunicación transparente de expectativas, límites y acuerdos en relaciones abiertas o poliamorosas.',
      'Fomento de redes comunitarias y espacios de apoyo mutuo afirmativos.'
    ],
    warningSigns: [
      'Aislamiento social involuntario derivado de discriminación o rechazo.',
      'Dinámicas relacionales coercitivas o vulneración reiterada de acuerdos afectivos.'
    ],
    knownUncertainties: [
      'Evolución dinámica de las vivencias identitarias y relacionales a lo largo del ciclo vital.'
    ],
    categorizedResources: [
      {
        name: 'Líneas Telefónicas de Atención en Crisis y Apoyo LGTBIQ+',
        type: 'URGENCIAS',
        typeLabel: 'Urgencias / Emergencias',
        description: 'Líneas de soporte emocional urgente ante situaciones de violencia, acoso o discriminación.',
        contact: '028 (Línea Arcoíris España) / 112'
      },
      {
        name: 'Servicios Públicos de Atención a la Diversidad Sexual y de Género (SAI)',
        type: 'SANITARIO_CLASICO',
        typeLabel: 'Atención Sanitaria Clásica',
        description: 'Atención psicológica, social y jurídica especializada en diversidad de género y relacional.',
        contact: 'Redes Municipales y Autonómicas SAI / OID'
      },
      {
        name: 'Entidades Comunitarias LGTBIQ+ y Grupos de Ayuda Mutua',
        type: 'REDUCCION_RIESGOS_DANOS',
        typeLabel: 'Reducción de Riesgos y Daños',
        description: 'Espacios de acogida, grupos de iguales, talleres de no monogamias éticas y empoderamiento.',
        contact: 'Imagina MÁS / Stop / CESIDA / FELGTBI+'
      }
    ],
    sources: [
      'CESIDA',
      'Imagina MÁS',
      'Stop',
      'World Professional Association for Transgender Health (WPATH)'
    ],
    keyConsiderations: [
      'Will respeta de forma irrestricta todas las identidades de género y orientaciones sexuales sin suposiciones preestablecidas.'
    ]
  }
];
