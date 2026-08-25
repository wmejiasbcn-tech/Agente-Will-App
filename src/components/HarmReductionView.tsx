import React, { useState } from 'react';
import {
  Shield,
  Search,
  Sparkles,
  AlertTriangle,
  Activity,
  Info,
  ChevronRight,
  RefreshCw,
  X,
  MessageSquare,
  Syringe,
  Flame,
  Heart,
  Globe2,
  BellRing,
  HelpCircle,
  Building2,
  Compass,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  HelpCircle as QuestionIcon,
  PhoneCall,
  FlameKindling,
  Workflow,
  Sparkle,
} from 'lucide-react';
import { SUBSTANCES_DATA } from '../data/substancesData';
import { SubstanceInfo } from '../types';

interface HarmReductionViewProps {
  onAskWillAboutTopic: (topic: string) => void;
}

export const HarmReductionView: React.FC<HarmReductionViewProps> = ({
  onAskWillAboutTopic,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeSubstance, setActiveSubstance] = useState<SubstanceInfo | null>(
    SUBSTANCES_DATA[0]
  );
  const [customTopic, setCustomTopic] = useState('');
  const [isExploringCustom, setIsExploringCustom] = useState(false);
  const [customResult, setCustomResult] = useState<any | null>(null);

  // 6 Categorías Principales Canónicas de Will App
  const canonicalDomains = [
    {
      id: 'all',
      num: '0',
      label: 'Todos los Dominios',
      shortLabel: 'Todos',
      color: 'border-stone-700 text-stone-200 bg-stone-900',
      activeColor: 'bg-stone-800 text-stone-100 border-amber-500',
      aphorism: 'Estructura Canónica de 6 Dominios con No Directividad',
    },
    {
      id: 'acompanamiento',
      num: '1',
      label: 'Acompañamiento No Directivo',
      shortLabel: '1. Acompañamiento',
      icon: Compass,
      color: 'border-amber-900/60 text-amber-300 bg-stone-950',
      activeColor: 'bg-amber-950/80 text-amber-200 border-amber-500 shadow-amber-900/30',
      aphorism: 'P.R.E.S.E.N.T.E. — Arquitectura no lineal: no es ruta, no es secuencia, no es protocolo.',
      desc: 'Escucha sin juicio, presencia, no diagnóstico ni prescripción.',
    },
    {
      id: 'salud-sexual',
      num: '2',
      label: 'Autogestión de la Salud Sexual',
      shortLabel: '2. Salud Sexual',
      icon: Stethoscope,
      color: 'border-cyan-900/60 text-cyan-300 bg-stone-950',
      activeColor: 'bg-cyan-950/80 text-cyan-200 border-cyan-500 shadow-cyan-900/30',
      aphorism: 'AUTOGESTIÓN INFORMADA — Decidir con información, no imponer conductas.',
      desc: 'Prácticas, anticoncepción, ITS (infección vs enfermedad), PrEP, PEP, I=I y cribado.',
    },
    {
      id: 'placer-sexual',
      num: '3',
      label: 'Autogestión del Placer Sexual',
      shortLabel: '3. Placer Sexual',
      icon: Heart,
      color: 'border-rose-900/60 text-rose-300 bg-stone-950',
      activeColor: 'bg-rose-950/80 text-rose-200 border-rose-500 shadow-rose-900/30',
      aphorism: 'EL PLACER NO ES PREVENCIÓN — El placer es una dimensión legítima y autónoma.',
      desc: 'Deseo, placer individual y compartido, consentimiento dinámico, BDSM y acuerdos.',
    },
    {
      id: 'consumo-psicotropicas',
      num: '4',
      label: 'Consumo No Problemático de Psicotrópicas',
      shortLabel: '4. Psicotrópicas',
      icon: Activity,
      color: 'border-indigo-900/60 text-indigo-300 bg-stone-950',
      activeColor: 'bg-indigo-950/80 text-indigo-200 border-indigo-500 shadow-indigo-900/30',
      aphorism: 'CONSUMO ≠ PROBLEMA — El problema lo identifica la persona, no Will.',
      desc: 'Farmacología recreativa, interacciones, alcohol, estimulantes, disociativos.',
    },
    {
      id: 'chemsex',
      num: '5',
      label: 'Reducción de Riesgos y Daños del Chemsex',
      shortLabel: '5. Chemsex',
      icon: Flame,
      color: 'border-amber-900/60 text-amber-300 bg-stone-950',
      activeColor: 'bg-amber-950/80 text-amber-200 border-amber-500 shadow-amber-900/30',
      aphorism: 'CHEMSEX NO ES SINÓNIMO DE PROBLEMA NI DE SLAM — Es un contexto específico.',
      desc: 'Sexo químico no inyectado, mefedrona, GHB/GBL, cuidados de mucosas y tiempos.',
    },
    {
      id: 'slam',
      num: '6',
      label: 'Reducción de Riesgos y Daños del SLAM',
      shortLabel: '6. SLAM',
      icon: Syringe,
      color: 'border-red-900/60 text-red-300 bg-stone-950',
      activeColor: 'bg-red-950/80 text-red-200 border-red-500 shadow-red-900/30',
      aphorism: 'SLAM NO ES SINÓNIMO DE CHEMSEX — Identidad propia (coexistente o independiente).',
      desc: 'Vía intravenosa, asepsia, salud vascular, señales de alarma sin instrucciones operativas.',
    },
  ];

  // Filtering substances based on domainId and search query
  const filteredSubstances = SUBSTANCES_DATA.filter((item) => {
    const matchesDomain =
      selectedDomain === 'all' || item.domainId === selectedDomain;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.pharmacology.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const currentDomainInfo = canonicalDomains.find((d) => d.id === selectedDomain);

  const handleExploreCustomTopic = async () => {
    if (!customTopic.trim() || isExploringCustom) return;

    setIsExploringCustom(true);
    setCustomResult(null);

    try {
      const response = await fetch('/api/explore-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: customTopic }),
      });

      if (!response.ok) {
        throw new Error('Error explorando sustancia');
      }

      const data = await response.json();
      setCustomResult(data);
    } catch (err: any) {
      console.error('Custom explore error:', err);
    } finally {
      setIsExploringCustom(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-stone-100">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold">
              6 DOMINIOS CANÓNICOS
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold">
              ARQUITECTURA DE DECISIÓN INFORMADA
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-mono">
              DIFERENCIACIÓN RIESGO vs DAÑO
            </span>
          </div>

          <div className="text-xs font-mono text-stone-400">
            WILL APP • BASE CONSTITUCIONAL WAIPL
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-400 shrink-0" />
            <span>Reducción de Riesgos y Daños & Autogestión Informada</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-4xl leading-relaxed">
            «Will distingue rigurosamente entre <strong className="text-amber-300 font-semibold">riesgo</strong> (probabilidad de ocurrencia de un evento adverso) y <strong className="text-emerald-300 font-semibold">daño</strong> (consecuencia lesiva concreta). Informar sobre riesgos no equivale a dirigir la conducta; permite anticipar escenarios y tomar decisiones soberanas. La reducción de daños interviene sobre las consecuencias para mitigar su impacto en la salud y la integridad.»
          </p>
        </div>

        {/* 6 Canonical Domains Selector Bar */}
        <div className="pt-2 border-t border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span className="uppercase tracking-wider">Categorías Principales de Will App:</span>
            {currentDomainInfo && currentDomainInfo.id !== 'all' && (
              <span className="text-amber-300 italic hidden sm:inline">
                «{currentDomainInfo.aphorism}»
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {canonicalDomains.map((dom) => {
              const Icon = dom.icon || Shield;
              const isSelected = selectedDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  id={`domain-filter-${dom.id}`}
                  onClick={() => setSelectedDomain(dom.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? dom.activeColor + ' shadow-md ring-1'
                      : dom.color + ' hover:border-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono opacity-70">
                      {dom.num === '0' ? '★' : `DOM ${dom.num}`}
                    </span>
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-2">
                    {dom.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search input */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por sustancia, práctica, mecanismo farmacológico o concepto técnico..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600 shadow-inner"
          />
        </div>
      </div>

      {/* Epistemological Harness & 7-Step Decisional Architecture & 3 Resource Types Info Box */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* 1. Arquitectura de Decisión Informada (7 pasos) */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-wider font-semibold">
            <Workflow className="w-4 h-4 text-amber-400" />
            <span>Arquitectura de Decisión (7 Pasos)</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Estructura secuencial no directiva donde la decisión reside siempre en la persona:
          </p>
          <div className="space-y-1.5 text-[11px] font-mono text-stone-300">
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-amber-400 font-bold">1.</span>
              <span><strong>Riesgos:</strong> Informar con rigor y arnés</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-amber-400 font-bold">2.</span>
              <span><strong>Comprensión:</strong> Verificar entendimiento</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-amber-400 font-bold">3.</span>
              <span><strong>Decisión:</strong> Soberana de la persona</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-amber-400 font-bold">4.</span>
              <span><strong>Posibles Daños:</strong> Consecuencias adversas</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-amber-400 font-bold">5.</span>
              <span><strong>Reducción:</strong> Estrategias de mitigación</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-amber-400 font-bold">6.</span>
              <span><strong>Recursos:</strong> Adecuados al contexto</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-amber-950/40 border border-amber-800/50 text-amber-200">
              <span className="text-amber-400 font-bold">7.</span>
              <span><strong>Autonomía:</strong> Decisión siempre en la persona</span>
            </div>
          </div>
        </div>

        {/* 2. Arnés Epistemológico de Transparencia */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Arnés Epistemológico</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Will etiqueta y transparenta el grado de certeza de cada afirmación farmacológica:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-mono font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>VERIFICADO</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Evidencia científica sólida disponible (ensayos clínicos, farmacocinética contrastada).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>INFERIDO</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Probable según evidencia parcial o similitud estructural (análogos de catinonas/disociativos).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-stone-400 font-mono font-bold text-[11px]">
                <QuestionIcon className="w-3.5 h-3.5" />
                <span>DESCONOCIDO</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Sin evidencia suficiente o variabilidad impredecible del mercado no regulado.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Tres Tipos de Recursos Sociosanitarios */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-300 uppercase tracking-wider font-semibold">
            <Building2 className="w-4 h-4 text-rose-400" />
            <span>3 Tipos de Recursos</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Will clasifica y provee recursos adecuados según el nivel de atención requerido:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-rose-300 font-mono font-bold text-[11px]">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>1. URGENCIAS / EMERGENCIAS</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Riesgo vital, sobredosis, punción arterial, pérdida de conciencia (112, 061, SAMUR).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold text-[11px]">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>2. ATENCIÓN SANITARIA CLÁSICA</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Urgencias hospitalarias, centros de salud, unidades de ITS, infectología, cribados.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                <span>3. REDUCCIÓN DE RIESGOS Y DAÑOS</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Centros comunitarios (Checkpoint, Energy Control, PIJ material estéril, asesoramiento entre iguales).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Substances list & Active Detail */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Substance Cards List */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[850px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-stone-400">
            <span>Fichas Técnicas ({filteredSubstances.length}):</span>
            <span>12 Puntos Canónicos</span>
          </div>

          {filteredSubstances.length === 0 ? (
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 text-center text-xs text-stone-400 space-y-2">
              <p>No se encontraron fichas para los criterios seleccionados.</p>
              <button
                onClick={() => {
                  setSelectedDomain('all');
                  setSearch('');
                }}
                className="text-amber-400 underline font-mono text-[11px]"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            filteredSubstances.map((item) => {
              const isSelected = activeSubstance?.id === item.id;
              return (
                <button
                  key={item.id}
                  id={`substance-card-${item.id}`}
                  onClick={() => {
                    setActiveSubstance(item);
                    setCustomResult(null);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'bg-amber-950/70 border-amber-600 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-stone-900/90 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                  }`}
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 text-amber-400 border border-stone-800">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-stone-100 truncate group-hover:text-amber-200">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-1">{item.summary}</p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-amber-400 translate-x-0.5' : 'text-stone-600'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: 12-Point Detailed Ficha View */}
        <div className="lg:col-span-8">
          {activeSubstance && !customResult && (
            <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
              {/* Point 1 & 2: Header of the substance & Context */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                      1. Identidad: {activeSubstance.category}
                    </span>
                    <span className="text-xs font-mono text-stone-400 px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                      2. Contexto Diferenciado
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {activeSubstance.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">
                    {activeSubstance.summary}
                  </p>
                </div>

                <button
                  id="btn-ask-will-substance"
                  onClick={() =>
                    onAskWillAboutTopic(
                      `Quiero analizar información farmacológica y de reducción de daños sobre ${activeSubstance.name}`
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Consultar a Will</span>
                </button>
              </div>

              {/* Point 3 & 4: Admin Routes & Sought Effects */}
              {(activeSubstance.adminRoutes || activeSubstance.soughtEffects) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {activeSubstance.adminRoutes && (
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        3. Vías de Administración
                      </span>
                      <ul className="space-y-1 text-xs text-stone-300">
                        {activeSubstance.adminRoutes.map((route, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{route}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeSubstance.soughtEffects && (
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" />
                        4. Efectos Buscados & Vivencia
                      </span>
                      <ul className="space-y-1 text-xs text-stone-300">
                        {activeSubstance.soughtEffects.map((eff, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{eff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Point 5: Pharmacology Box */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  5. Mecanismo Neuroquímico & Farmacología
                </span>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                  {activeSubstance.pharmacology}
                </p>
              </div>

              {/* Point 6: Objective Risks (Risk vs Harm distinction) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    6. Riesgos Objetivos (Anticipación de Escenarios)
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">
                    Informar ≠ Conducir
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-stone-300">
                  {activeSubstance.objectiveRisksAndInteractions.map((risk, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-start gap-2"
                    >
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Point 7: Critical Interactions */}
              {activeSubstance.criticalInteractions && activeSubstance.criticalInteractions.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    7. Interacciones Críticas & Contraindicaciones
                  </span>
                  <ul className="space-y-1 text-xs text-stone-200">
                    {activeSubstance.criticalInteractions.map((inter, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{inter}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Point 8: Harm Reduction Facts (Non-operational) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    8. Reducción de Daños (No Operacional)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/80">
                    Mitigación sin recetas de ejecución
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-stone-300">
                  {activeSubstance.harmReductionFacts.map((fact, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Point 9: Warning Signs & Complications */}
              {activeSubstance.warningSigns && activeSubstance.warningSigns.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                    <BellRing className="w-3.5 h-3.5" />
                    9. Señales de Alarma & Complicaciones
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-200">
                    {activeSubstance.warningSigns.map((sign, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Point 10: Known Uncertainties */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  10. Incertidumbres y Variabilidad del Mercado
                </span>
                <ul className="space-y-1 text-xs text-stone-300">
                  {activeSubstance.knownUncertainties.map((unc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{unc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Point 11: Community & Healthcare Resources */}
              {activeSubstance.communityResources && activeSubstance.communityResources.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    11. Recursos Comunitarios & Sociosanitarios
                  </span>
                  <ul className="space-y-1 text-xs text-stone-300">
                    {activeSubstance.communityResources.map((res, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Point 12: Sources */}
              {activeSubstance.sources && activeSubstance.sources.length > 0 && (
                <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-[11px] text-stone-400 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-stone-400" />
                    12. Red Canónica de Fuentes Verificadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSubstance.sources.map((src, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 font-mono text-[10px]"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom AI Query Result if active */}
          {customResult && (
            <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <span className="text-xs font-mono text-amber-400">FICHA TÉCNICA CANÓNICA GENERADA</span>
                  <h2 className="text-2xl font-serif font-bold text-stone-100">
                    {customResult.title}
                  </h2>
                </div>
                <button
                  onClick={() => setCustomResult(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed">
                {customResult.summary}
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                  Farmacología & Mecanismo
                </span>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {customResult.pharmacology}
                </p>
              </div>

              {customResult.objectiveRisksAndInteractions && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-rose-400 font-semibold">
                    Riesgos Objetivos
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-stone-300">
                    {customResult.objectiveRisksAndInteractions.map((r: string, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {customResult.harmReductionFacts && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                    Reducción de Daños (No Operacional)
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-stone-300">
                    {customResult.harmReductionFacts.map((f: string, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Deep-Dive Exploration on any custom topic or mix */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-serif font-bold text-stone-100">
            Consultar otra sustancia, mezcla o duda técnica con ADN WAIPL
          </h3>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">
          Will generará una ficha farmacológica neutral y transparente de 12 puntos, reconociendo incertidumbres, diferenciando riesgos de daños y sin dictados morales ni recetas operacionales.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExploreCustomTopic();
            }}
            placeholder="Ejemplo: 'Interacción entre cocaína y alcohol (cocaetileno)' o 'SLAM de 3-MMC y cuidado vascular'..."
            className="flex-1 w-full p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs placeholder-stone-500 focus:outline-none focus:border-amber-600 shadow-inner"
          />
          <button
            onClick={handleExploreCustomTopic}
            disabled={!customTopic.trim() || isExploringCustom}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-md"
          >
            {isExploringCustom ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Ficha de 12 Puntos</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
