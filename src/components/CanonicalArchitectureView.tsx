import React, { useState } from 'react';
import {
  Shield,
  Compass,
  Heart,
  Activity,
  Flame,
  Syringe,
  Stethoscope,
  Scale,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Building2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Layers,
  Zap,
  Info,
  Maximize2,
  Workflow,
  Search,
  Globe2,
  BellRing,
  X,
} from 'lucide-react';
import {
  CANONICAL_CORE_PRINCIPLE,
  CANONICAL_DOMAINS,
  CANONICAL_RISK_VS_HARM,
  CANONICAL_INFORMED_DECISION_ARCHITECTURE,
  CANONICAL_TRANSVERSAL_LAYERS,
  CANONICAL_EPISTEMIC_HARNESS,
  CANONICAL_RESOURCE_TYPES,
  CANONICAL_CONTEXTUAL_DIFFERENTIATION_MATRIX,
  CanonicalDomainDetail,
} from '../data/canonicalArchitectureData';
import { SUBSTANCES_DATA } from '../data/substancesData';
import { CanonicalDomainId, SubstanceInfo } from '../types';

interface CanonicalArchitectureViewProps {
  onNavigateToChat: (prefilledPrompt?: string, domainId?: string) => void;
  onNavigateToConstitution: () => void;
  onNavigateToPresente: (dimensionCode?: string) => void;
  onNavigateToAuditor: (prompt?: string) => void;
  onOpenEmergency: () => void;
}

export const CanonicalArchitectureView: React.FC<CanonicalArchitectureViewProps> = ({
  onNavigateToChat,
  onNavigateToConstitution,
  onNavigateToPresente,
  onNavigateToAuditor,
  onOpenEmergency,
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<CanonicalDomainId>('acompanamiento');
  const [selectedFicha, setSelectedFicha] = useState<SubstanceInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionTab, setActiveSectionTab] = useState<
    'domains' | 'risk-harm' | 'decision-7' | 'epistemology' | 'resources' | 'fichas'
  >('domains');

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
        return Shield;
    }
  };

  // Filtered substance fichas by active domain and search
  const domainFichas = SUBSTANCES_DATA.filter((item) => {
    const matchesDomain = item.domainId === selectedDomainId;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pharmacology.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-stone-100 font-sans">
      {/* SECTION I: NÚCLEO CONSTITUCIONAL SUPERIOR (WILL) */}
      <section
        id="canonical-core-principle"
        className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-800/80 shadow-2xl relative overflow-hidden space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-800/40 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wider">
              NIVEL I • NÚCLEO CONSTITUCIONAL
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-mono">
              ARQUITECTURA CANÓNICA
            </span>
          </div>
          <span className="text-xs font-mono text-amber-400/90 font-semibold tracking-wide">
            ADN WAIPL • INMUTABLE
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-stone-950 font-serif font-black text-3xl shadow-lg">
                W
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-100 tracking-tight">
                  {CANONICAL_CORE_PRINCIPLE.name}
                </h1>
                <p className="text-base sm:text-lg text-amber-300 font-medium mt-0.5 font-serif">
                  {CANONICAL_CORE_PRINCIPLE.subtitle}
                </p>
              </div>
            </div>

            {/* Canonical Motto Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/70 border border-amber-600/80 text-amber-100 font-serif text-base sm:text-xl italic leading-snug shadow-md">
              {CANONICAL_CORE_PRINCIPLE.fundamentalMotto}
            </div>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-3xl">
              Will existe para proporcionar acompañamiento neutral, comprensión técnica y reducción de daños rigurosa sin infantilizar ni dirigir. <strong className="text-amber-300 font-semibold">{CANONICAL_CORE_PRINCIPLE.sovereigntyDeclaration}</strong>
            </p>
          </div>

          {/* Will Does vs Will Never Does */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Will Acompaña & Facilita:
              </span>
              <ul className="space-y-1 text-xs text-stone-300">
                {CANONICAL_CORE_PRINCIPLE.willDoes.slice(0, 5).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Will NUNCA Conduce Ni Prescribe:
              </span>
              <ul className="space-y-1 text-xs text-stone-400">
                {CANONICAL_CORE_PRINCIPLE.willNeverDoes.slice(0, 4).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION II: LAS 6 CATEGORÍAS CANÓNICAS (6 DOMINIOS PRINCIPALES) */}
      <section id="canonical-6-domains" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold">
                NIVEL II
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                Las 6 Categorías Canónicas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Seis dominios de acompañamiento principales e independientes con entidad técnica y conceptual propia.
            </p>
          </div>

          <div className="text-xs font-mono text-amber-400">
            «El continente debe reflejar el contenido»
          </div>
        </div>

        {/* 6 Independent Canonical Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CANONICAL_DOMAINS.map((domain) => {
            const Icon = getDomainIcon(domain.id);
            const isSelected = selectedDomainId === domain.id;

            return (
              <div
                key={domain.id}
                id={`domain-card-${domain.id}`}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between gap-4 relative overflow-hidden group ${
                  isSelected
                    ? `bg-stone-900 ${domain.colorScheme.border} ring-2 ring-${domain.colorScheme.accent}-500/40 shadow-xl`
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${domain.colorScheme.badgeBg}`}
                    >
                      DOMINIO {domain.number}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center bg-stone-950 border border-stone-800 ${domain.colorScheme.text}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                      {domain.title}
                    </h3>
                    <p className="text-xs text-stone-400 font-sans leading-snug">
                      {domain.tagline}
                    </p>
                  </div>

                  {/* Differentiation Rule / Axiom Callout */}
                  <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 text-[11px] text-stone-300 font-mono italic">
                    {domain.differentiationRule}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-stone-400">
                    {domain.subcategories.length} subcategorías
                  </span>
                  <span
                    className={`font-semibold flex items-center gap-1 transition-colors ${
                      isSelected ? domain.colorScheme.text : 'text-stone-400 group-hover:text-stone-200'
                    }`}
                  >
                    <span>Ver ficha del dominio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Domain Expanded Detail Panel */}
        {activeDomain && (
          <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeDomain.colorScheme.badgeBg}`}
                >
                  {React.createElement(getDomainIcon(activeDomain.id), { className: 'w-6 h-6' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      DOMINIO {activeDomain.number} DE 6
                    </span>
                    <span className="text-xs text-stone-500">•</span>
                    <span className="text-xs text-stone-400 font-mono">Entidad Autónoma</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                    {activeDomain.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    onNavigateToChat(
                      `Quiero analizar información neutral y rigurosa sobre el dominio: ${activeDomain.title}`,
                      activeDomain.id
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Consultar a Will sobre este dominio</span>
                </button>
              </div>
            </div>

            {/* Aphorism Banner */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-200 font-serif italic flex items-start gap-3">
              <span className="text-amber-400 font-bold not-italic font-mono">AXIOMA:</span>
              <p>«{activeDomain.axiom}»</p>
            </div>

            {/* Subcategories Grid */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                Subcategorías y Alcance Canónico del Dominio {activeDomain.number}:
              </span>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                {activeDomain.subcategories.map((sub, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 flex items-start gap-2 hover:border-stone-700 transition-colors"
                  >
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="text-stone-300 font-sans">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Inquiries */}
            <div className="pt-2 border-t border-stone-800/60 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                Consultas canónicas de ejemplo para este dominio:
              </span>
              <div className="grid sm:grid-cols-2 gap-2">
                {activeDomain.sampleInquiries.map((inq, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigateToChat(inq, activeDomain.id)}
                    className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-600 text-left text-xs text-stone-300 hover:text-amber-200 italic font-serif flex items-center justify-between gap-2 transition-all group"
                  >
                    <span>«{inq}»</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION III: DIFERENCIACIÓN FUNDAMENTAL: RIESGO ≠ DAÑO & METÁFORA DEL BARRANCO */}
      <section
        id="canonical-risk-vs-harm"
        className="rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-6 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold">
                NIVEL III
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                {CANONICAL_RISK_VS_HARM.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              {CANONICAL_RISK_VS_HARM.subtitle}
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400/90 font-semibold">
            PRESENCIA ARQUITECTÓNICA PROPIA
          </span>
        </div>

        {/* The Two Distinct Columns: RIESGO vs DAÑO */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Column 1: RIESGO */}
          <div className="p-6 rounded-2xl bg-stone-950 border border-amber-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80">
                CONCEPTO A
              </span>
              <span className="text-xs font-mono text-stone-400">Probabilidad & Escenario</span>
            </div>
            <h3 className="text-2xl font-serif font-black text-amber-300">
              {CANONICAL_RISK_VS_HARM.riskDefinition.title}
            </h3>
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 font-mono text-xs text-amber-200 font-bold">
              {CANONICAL_RISK_VS_HARM.riskDefinition.actionChain}
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {CANONICAL_RISK_VS_HARM.riskDefinition.explanation}
            </p>
            <div className="p-3 rounded-xl bg-stone-900 text-xs text-stone-400 border border-stone-800">
              <strong className="text-amber-300 font-semibold">Regla Canónica:</strong> Informar sobre un riesgo NO es una orden de conducta ni una recomendación paternalista.
            </div>
          </div>

          {/* Column 2: DAÑO */}
          <div className="p-6 rounded-2xl bg-stone-950 border border-emerald-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                CONCEPTO B
              </span>
              <span className="text-xs font-mono text-stone-400">Consecuencia & Mitigación</span>
            </div>
            <h3 className="text-2xl font-serif font-black text-emerald-300">
              {CANONICAL_RISK_VS_HARM.harmDefinition.title}
            </h3>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50 font-mono text-xs text-emerald-200 font-bold">
              {CANONICAL_RISK_VS_HARM.harmDefinition.actionChain}
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {CANONICAL_RISK_VS_HARM.harmDefinition.explanation}
            </p>
            <div className="p-3 rounded-xl bg-stone-900 text-xs text-stone-400 border border-stone-800">
              <strong className="text-emerald-300 font-semibold">Regla Canónica:</strong> La reducción de daños actúa sobre las consecuencias; NO es una prohibición encubierta.
            </div>
          </div>
        </div>

        {/* Metáfora Conceptual Canónica: El Barranco y el Casco */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-stone-950 via-stone-950 to-amber-950/30 border border-amber-800/60 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <Workflow className="w-4 h-4" />
            <span>{CANONICAL_RISK_VS_HARM.metaphor.title}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1 text-xs">
              <span className="text-amber-400 font-bold font-mono">1. EL BARRANCO = RIESGO</span>
              <p className="text-stone-300">{CANONICAL_RISK_VS_HARM.metaphor.cliff}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1 text-xs">
              <span className="text-emerald-400 font-bold font-mono">2. EL CASCO / PROTECCIONES = REDUCCIÓN DE DAÑOS</span>
              <p className="text-stone-300">{CANONICAL_RISK_VS_HARM.metaphor.gear}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-700/80 text-amber-100 font-serif text-center text-sm sm:text-base italic font-bold">
            {CANONICAL_RISK_VS_HARM.metaphor.axiom}
          </div>

          <div className="grid sm:grid-cols-3 gap-2 pt-1 text-xs text-stone-300">
            {CANONICAL_RISK_VS_HARM.metaphor.notices.map((notice, i) => (
              <div key={i} className="p-3 rounded-lg bg-stone-950/80 border border-stone-800/80">
                <span className="text-amber-400 font-bold">• </span>
                {notice}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION IV: ARQUITECTURA DE DECISIÓN INFORMADA (7 PASOS CONCEPTUALES) */}
      <section
        id="canonical-decision-7-steps"
        className="rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-6 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold">
                NIVEL IV
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                Arquitectura de Decisión Informada
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              Secuencia conceptual de 7 pasos: relación lógica de soberanía, NO un itinerario obligatorio impuesto.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-400">7 Pasos Canónicos</span>
        </div>

        {/* 7-Step Horizontal / Responsive Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
          {CANONICAL_INFORMED_DECISION_ARCHITECTURE.map((step) => (
            <div
              key={step.step}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 ${
                step.step === 7
                  ? 'bg-amber-950/80 border-amber-600 text-amber-100 shadow-md ring-1 ring-amber-500/40'
                  : 'bg-stone-950/80 border-stone-800 text-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    step.step === 7
                      ? 'bg-amber-900 text-amber-200'
                      : 'bg-stone-900 text-amber-400 border border-stone-800'
                  }`}
                >
                  0{step.step}
                </span>
                <span className="text-[10px] font-mono text-stone-500">PASO</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-serif font-bold text-stone-100 tracking-tight">
                  {step.name}
                </h4>
                <p className="text-[11px] text-stone-400 font-sans leading-tight">
                  {step.shortDesc}
                </p>
              </div>

              <p className="text-[10px] text-stone-500 font-mono pt-1 border-t border-stone-800/60 leading-tight">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION V & VI: CAPAS TRANSVERSALES DE GOBIERNO & ARNÉS EPISTEMOLÓGICO */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Capas Transversales (Governing Layers) */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold">
                NIVEL V
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Capas Transversales de Gobierno
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-400">No son categorías temáticas</span>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            Estructuras arquitectónicas transversales que gobiernan y auditan los seis dominios principales:
          </p>

          <div className="space-y-3">
            {CANONICAL_TRANSVERSAL_LAYERS.map((layer) => (
              <div
                key={layer.id}
                className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 hover:border-stone-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {layer.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">
                    {layer.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{layer.role}</p>
                <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-800/80 text-[11px] font-serif italic text-amber-300/90">
                  {layer.axiom}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={onNavigateToConstitution}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-mono text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Constitución WAIPL</span>
            </button>
            <button
              onClick={() => onNavigateToPresente()}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-mono text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ver Marco P.R.E.S.E.N.T.E.</span>
            </button>
            <button
              onClick={() => onNavigateToAuditor()}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-mono text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Abrir Auditor Constitucional</span>
            </button>
          </div>
        </div>

        {/* Arnés Epistemológico (Epistemic Harness) */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold">
                NIVEL VI
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Arnés Epistemológico
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-400">Transparencia de Certeza</span>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            Toda información técnica y médica se transparenta con su grado estricto de evidencia científica:
          </p>

          <div className="space-y-3">
            {CANONICAL_EPISTEMIC_HARNESS.map((ep) => (
              <div
                key={ep.status}
                className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${ep.badgeBg}`}
                  >
                    {ep.title}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">GRADO EPISTÉMICO</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{ep.description}</p>
                <p className="text-[11px] text-stone-400 font-mono italic">
                  ↳ Regla: {ep.rule}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200/90 font-serif italic">
            «No convertir probabilidades en hechos. No presentar inferencias como certezas. No inventar información.»
          </div>
        </div>
      </div>

      {/* SECTION VII: TRES TIPOS DE RECURSOS SOCIOSANITARIOS */}
      <section
        id="canonical-3-resources"
        className="rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-6 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold">
                NIVEL VII
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                Tres Tipos de Recursos
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              Diferenciación estricta de niveles de atención sin derivaciones hospitalarias indiscriminadas.
            </p>
          </div>

          <button
            onClick={onOpenEmergency}
            className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>Ver Teléfonos de Urgencia (SOS)</span>
          </button>
        </div>

        {/* 3 Columns */}
        <div className="grid md:grid-cols-3 gap-4">
          {CANONICAL_RESOURCE_TYPES.map((res) => (
            <div
              key={res.type}
              className={`p-5 rounded-2xl border space-y-3.5 flex flex-col justify-between ${res.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    {res.title}
                  </span>
                  <Building2 className={`w-4 h-4 ${res.iconColor}`} />
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">{res.scope}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-800/60">
                <span className="text-[10px] font-mono uppercase text-stone-400">
                  Ejemplos Canónicos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {res.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-stone-950/80 border border-stone-800 text-[11px] font-mono text-stone-300"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] font-serif italic text-stone-400 pt-1">«{res.axiom}»</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION VIII: REGLA DE DIFERENCIACIÓN CONTEXTUAL (MATRIZ DE COEXISTENCIA) */}
      <section
        id="canonical-context-differentiation"
        className="rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-6 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold">
                NIVEL VIII
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                Regla de Diferenciación Contextual
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              Detección multidimensional no excluyente: los conceptos pueden relacionarse pero nunca fusionarse por defecto.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-800/80 text-amber-300 font-mono text-xs font-bold text-center">
            SEXO ≠ PLACER ≠ SUSTANCIAS ≠ CHEMSEX ≠ SLAM
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CANONICAL_CONTEXTUAL_DIFFERENTIATION_MATRIX.slice(1).map((mat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {mat.relation}
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">≠</span>
              </div>
              <p className="text-xs text-stone-200 font-semibold">{mat.doesNotImply}</p>
              <p className="text-[11px] text-stone-400 leading-snug">{mat.rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION IX: EXPLORADOR DE FICHAS TÉCNICAS CANÓNICAS POR DOMINIO (12 PUNTOS) */}
      <section
        id="canonical-fichas-explorer"
        className="rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-6 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold">
                NIVEL IX
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                Fichas Técnicas Canónicas por Dominio
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              12 Puntos de rigor estructurados según el ADN WAIPL para cada sustancia y práctica.
            </p>
          </div>

          {/* Search bar inside fichas */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en este dominio..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Domain Tabs for Fichas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CANONICAL_DOMAINS.map((dom) => {
            const Icon = getDomainIcon(dom.id);
            const isSelected = selectedDomainId === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => {
                  setSelectedDomainId(dom.id);
                  setSelectedFicha(null);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-1.5 ${
                  isSelected
                    ? `${dom.colorScheme.badgeBg} shadow-md`
                    : 'bg-stone-950/70 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate font-semibold">{dom.shortTitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fichas Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {domainFichas.map((ficha) => (
            <div
              key={ficha.id}
              onClick={() => setSelectedFicha(ficha)}
              className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-600 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-amber-400 border border-stone-800">
                  {ficha.category}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-200">
                {ficha.name}
              </h4>
              <p className="text-xs text-stone-400 line-clamp-2">{ficha.summary}</p>
            </div>
          ))}
        </div>

        {/* Detailed Modal / Bottom Card for Selected Ficha */}
        {selectedFicha && (
          <div className="rounded-3xl bg-stone-950 border border-amber-700/80 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  FICHA TÉCNICA CANÓNICA DE 12 PUNTOS
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-100">
                  {selectedFicha.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFicha(null)}
                className="p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-stone-100 border border-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
                <span className="font-mono text-amber-400 font-bold block">
                  1. Resumen & Identidad
                </span>
                <p className="text-stone-300 leading-relaxed">{selectedFicha.summary}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
                <span className="font-mono text-amber-400 font-bold block">
                  5. Mecanismo & Farmacología
                </span>
                <p className="text-stone-300 leading-relaxed">{selectedFicha.pharmacology}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                <span className="font-mono text-rose-400 font-bold block">
                  6. Riesgos Objetivos
                </span>
                <ul className="space-y-1 text-stone-300">
                  {selectedFicha.objectiveRisksAndInteractions.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                <span className="font-mono text-emerald-400 font-bold block">
                  8. Reducción de Daños (No Operacional)
                </span>
                <ul className="space-y-1 text-stone-300">
                  {selectedFicha.harmReductionFacts.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() =>
                  onNavigateToChat(
                    `Quiero consultar información técnica y de reducción de daños sobre ${selectedFicha.name}`
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Consultar a Will sobre esta ficha</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
