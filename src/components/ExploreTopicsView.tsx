import React, { useState } from 'react';
import {
  Compass,
  Stethoscope,
  Heart,
  Activity,
  Flame,
  Syringe,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Shield,
  Layers,
  ExternalLink,
} from 'lucide-react';
import {
  CANONICAL_DOMAINS,
  HUMAN_ENTRANCE_DOORS,
  HUMAN_EPISTEMIC_LABELS,
  CanonicalDomainDetail,
} from '../data/canonicalArchitectureData';
import { SUBSTANCES_DATA } from '../data/substancesData';
import { CanonicalDomainId, SubstanceInfo } from '../types';

interface ExploreTopicsViewProps {
  onAskWill: (prompt: string, domainId?: string) => void;
  onOpenEmergency: () => void;
}

export const ExploreTopicsView: React.FC<ExploreTopicsViewProps> = ({
  onAskWill,
  onOpenEmergency,
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<CanonicalDomainId>('acompanamiento');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFichaId, setExpandedFichaId] = useState<string | null>(null);

  const activeDomain =
    CANONICAL_DOMAINS.find((d) => d.id === selectedDomainId) || CANONICAL_DOMAINS[0];

  const getDomainIcon = (id: CanonicalDomainId) => {
    switch (id) {
      case 'acompanamiento':
        return Compass;
      case 'salud-sexual':
        return Stethoscope;
      case 'placer-sexual':
        return Heart;
      case 'consumo-psicotropicas':
        return Activity;
      case 'chemsex':
        return Flame;
      case 'slam':
        return Syringe;
      default:
        return Compass;
    }
  };

  const domainFichas = SUBSTANCES_DATA.filter((item) => {
    const matchesDomain = item.domainId === selectedDomainId;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pharmacology.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const ActiveIcon = getDomainIcon(activeDomain.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-stone-100 font-sans">
      {/* Friendly Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-stone-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Explorar Áreas y Temas
        </h1>
        <p className="text-sm sm:text-base text-stone-400 max-w-3xl leading-relaxed">
          Información clara, independiente y basada en evidencia sobre cada área. Consulta lo que
          necesites y amplía los detalles a tu ritmo, sin juicios ni prescripciones.
        </p>
      </div>

      {/* 6 Human Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {CANONICAL_DOMAINS.map((domain) => {
          const Icon = getDomainIcon(domain.id);
          const isSelected = selectedDomainId === domain.id;
          return (
            <button
              key={domain.id}
              id={`topic-tab-${domain.id}`}
              onClick={() => {
                setSelectedDomainId(domain.id);
                setExpandedFichaId(null);
              }}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all relative ${
                isSelected
                  ? `${domain.colorScheme.border} ${domain.colorScheme.badgeBg} ring-1 ring-amber-500/50 shadow-md`
                  : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-stone-500 font-medium">
                  {domain.number}
                </span>
              </div>
              <span
                className={`text-xs font-semibold leading-tight line-clamp-1 ${
                  isSelected ? domain.colorScheme.text : 'text-stone-200'
                }`}
              >
                {domain.doorTitle || domain.shortTitle}
              </span>
              <span className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 font-normal">
                {domain.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Area Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border bg-gradient-to-br ${activeDomain.colorScheme.gradient} ${activeDomain.colorScheme.border} shadow-xl space-y-5`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${activeDomain.colorScheme.badgeBg} border ${activeDomain.colorScheme.border}`}
            >
              <ActiveIcon className={`w-6 h-6 ${activeDomain.colorScheme.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${activeDomain.colorScheme.badgeBg}`}
                >
                  {activeDomain.shortTitle}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 mt-1">
                {activeDomain.doorTitle}
              </h2>
              <p className="text-sm text-stone-300 mt-0.5">{activeDomain.doorSubtitle || activeDomain.tagline}</p>
            </div>
          </div>

          <button
            id={`talk-will-btn-${activeDomain.id}`}
            onClick={() => onAskWill(activeDomain.sampleInquiries[0], activeDomain.id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition-colors shrink-0 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hablar de esto con Will</span>
          </button>
        </div>

        {/* Clear Explanation */}
        <div className="grid md:grid-cols-12 gap-5">
          <div className="md:col-span-8 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400">
              ¿De qué trata este espacio?
            </h3>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
              {activeDomain.description}
            </p>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-300 text-xs leading-relaxed space-y-1">
              <span className="font-semibold text-amber-300 block">Posición de Will:</span>
              <p>{activeDomain.willStance}</p>
            </div>
          </div>

          {/* Subtopics / Subcategories */}
          <div className="md:col-span-4 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Temas habituales
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {activeDomain.subcategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-900/80 border border-stone-800 text-stone-300"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Questions to ask Will */}
        <div className="pt-2 border-t border-stone-800/80 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
            Preguntas habituales que puedes hacerle a Will:
          </span>
          <div className="grid sm:grid-cols-2 gap-2">
            {activeDomain.sampleInquiries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onAskWill(q, activeDomain.id)}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800/90 text-left text-xs text-stone-200 hover:text-amber-300 transition-colors group"
              >
                <span className="line-clamp-2">«{q}»</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Information Cards (Fichas Informativas Progresivas) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-100">
              Fichas Informativas y Guías ({domainFichas.length})
            </h3>
            <p className="text-xs text-stone-400">
              Muestra primero lo necesario. Despliega cualquier ficha si quieres conocer más
              detalles farmacológicos, interacciones y recursos.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar sustancia o tema..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
          </div>
        </div>

        {domainFichas.length === 0 ? (
          <div className="p-8 rounded-2xl bg-stone-900/40 border border-stone-800 text-center space-y-2">
            <p className="text-sm text-stone-400">
              No se encontraron fichas específicas con los términos de búsqueda en esta área.
            </p>
            <button
              onClick={() => onAskWill(searchQuery || 'Quiero información sobre este tema', activeDomain.id)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              Preguntárselo directamente a Will en el chat <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {domainFichas.map((ficha) => {
              const isExpanded = expandedFichaId === ficha.id;
              const epistemic =
                ficha.epistemicStatus && HUMAN_EPISTEMIC_LABELS[ficha.epistemicStatus]
                  ? HUMAN_EPISTEMIC_LABELS[ficha.epistemicStatus]
                  : HUMAN_EPISTEMIC_LABELS.VERIFICADO;

              return (
                <div
                  key={ficha.id}
                  id={`ficha-${ficha.id}`}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'bg-stone-900 border-amber-800/80 shadow-lg'
                      : 'bg-stone-900/70 border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  {/* Ficha Header (Always visible - concise & friendly) */}
                  <div
                    onClick={() => setExpandedFichaId(isExpanded ? null : ficha.id)}
                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-stone-100 font-serif">
                          {ficha.name}
                        </h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${epistemic.badgeBg} flex items-center gap-1`}
                          title={epistemic.humanDescription}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${epistemic.dotBg}`} />
                          {epistemic.humanTitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                        {ficha.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <button
                        type="button"
                        className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 font-medium px-2 py-1 rounded bg-stone-800/60"
                      >
                        <span>{isExpanded ? 'Menos info' : 'Ver detalles'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Ficha Expanded Details (Progressive Disclosure) */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-stone-800/80 space-y-5 text-xs text-stone-300">
                      {/* Vías y Farmacología */}
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80">
                          <span className="font-semibold text-stone-200 text-[11px] uppercase tracking-wider block">
                            Farmacología y Mecanismo
                          </span>
                          <p className="text-stone-300 leading-relaxed">{ficha.pharmacology}</p>
                        </div>

                        {ficha.adminRoutes && (
                          <div className="space-y-1.5 p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80">
                            <span className="font-semibold text-stone-200 text-[11px] uppercase tracking-wider block">
                              Vías de administración habituales
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {ficha.adminRoutes.map((r, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px]"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Riesgos objetivos vs Reducción de Daños */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40">
                          <span className="font-semibold text-amber-300 text-[11px] uppercase tracking-wider block">
                            Riesgos objetivos e interacciones
                          </span>
                          <ul className="space-y-1 text-stone-300 list-disc list-inside">
                            {ficha.objectiveRisksAndInteractions.map((r, i) => (
                              <li key={i} className="leading-relaxed">
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                          <span className="font-semibold text-emerald-300 text-[11px] uppercase tracking-wider block">
                            Cuidado y Reducción de Daños
                          </span>
                          <ul className="space-y-1 text-stone-300 list-disc list-inside">
                            {ficha.harmReductionFacts.map((h, i) => (
                              <li key={i} className="leading-relaxed">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Señales de alarma si existen */}
                      {ficha.warningSigns && ficha.warningSigns.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-1.5">
                          <span className="font-semibold text-rose-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            Señales que requieren atención médica
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ficha.warningSigns.map((w, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/60 text-rose-200 text-[11px]"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ask Will About this Ficha */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800">
                        <span className="text-stone-400 text-[11px]">
                          Fuentes y evidencia: {ficha.sources?.join(', ') || 'Clínicas y farmacológicas contrastadas'}
                        </span>
                        <button
                          onClick={() =>
                            onAskWill(
                              `Quiero informarme sobre ${ficha.name}, sus interacciones farmacológicas y cuidados clave.`,
                              ficha.domainId
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Preguntar a Will sobre {ficha.name}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
