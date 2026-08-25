import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Zap,
  ArrowRight,
  Network,
  Globe2,
  Cpu,
  Layers,
} from 'lucide-react';
import { CONSTITUTIONAL_HEADER, CONSTITUTIONAL_ARTICLES, ECOSYSTEM_APPENDIX } from '../data/constitutionalData';

interface ConstitutionViewProps {
  onOpenAuditorWithPrompt?: (prompt: string) => void;
}

export const ConstitutionView: React.FC<ConstitutionViewProps> = ({
  onOpenAuditorWithPrompt,
}) => {
  const [search, setSearch] = useState('');
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({
    I: true,
    II: true,
    III: false,
    IV: true,
    V: true,
    VI: false,
    VII: false,
    VIII: false,
  });
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  const toggleArticle = (num: string) => {
    setExpandedArticles((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const handleCopyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
    setCopiedQuote(quote);
    setTimeout(() => setCopiedQuote(null), 2000);
  };

  const filteredArticles = CONSTITUTIONAL_ARTICLES.filter(
    (art) =>
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      art.fullText.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      art.keyQuotes.some((q) => q.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-stone-100">
      {/* Canonical Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-900/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-64 h-64 text-amber-300" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono tracking-wider font-semibold">
              DOCUMENTO CONSTITUCIONAL
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-mono">
              ADN WAIPL • INMUTABLE
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight">
            {CONSTITUTIONAL_HEADER.title}
          </h1>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/60 border border-amber-700/80 text-amber-100 font-serif text-base sm:text-xl italic leading-snug">
            «{CONSTITUTIONAL_HEADER.canonicalMotto}»
          </div>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-3xl">
            {CONSTITUTIONAL_HEADER.declaration}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {CONSTITUTIONAL_HEADER.notices.map((notice, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-400 font-mono flex items-center gap-1.5"
              >
                <span className="text-rose-400 font-bold">✕</span>
                <span>{notice}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en los 8 artículos canónicos..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span>8 Artículos Canónicos</span>
          <span>•</span>
          <span className="text-amber-400 font-mono">Restricción Arquitectónica</span>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {filteredArticles.map((art) => {
          const isOpen = expandedArticles[art.number] ?? false;

          return (
            <div
              key={art.number}
              id={`article-${art.number}`}
              className="rounded-2xl bg-stone-900/90 border border-stone-800 overflow-hidden transition-all shadow-md hover:border-stone-700"
            >
              {/* Article Header */}
              <button
                onClick={() => toggleArticle(art.number)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 focus:outline-none bg-stone-900/60 hover:bg-stone-850 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded bg-amber-950 border border-amber-800/80 text-amber-300 font-mono font-bold text-xs">
                      ARTÍCULO {art.number}
                    </span>
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-100">
                      {art.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-400 font-sans">
                    {art.subtitle}
                  </p>
                </div>

                <div className="p-1 rounded-lg bg-stone-800 text-stone-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Article Expanded Content */}
              {isOpen && (
                <div className="p-5 sm:p-6 pt-0 border-t border-stone-800/60 space-y-6">
                  {/* Full Text Paragraphs */}
                  <div className="space-y-3 pt-4 text-sm text-stone-300 leading-relaxed font-sans">
                    {art.fullText.map((p, idx) => (
                      <p key={idx} className="bg-stone-950/40 p-3 rounded-xl border border-stone-800/60">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Key Quotes Box */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      Axiomas y Citas Clave
                    </span>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {art.keyQuotes.map((quote, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/50 flex flex-col justify-between gap-3 text-xs text-amber-200/90 font-serif italic"
                        >
                          <p>«{quote}»</p>
                          <button
                            onClick={() => handleCopyQuote(quote)}
                            className="self-end flex items-center gap-1 text-[11px] text-amber-400/80 hover:text-amber-300 transition-colors font-sans not-italic"
                          >
                            {copiedQuote === quote ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Architectural Rules */}
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Implicaciones Arquitectónicas Obligatorias
                    </span>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-stone-300">
                      {art.architecturalRules.map((rule, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Action to Test this Article */}
                  {onOpenAuditorWithPrompt && art.number === 'V' && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 to-stone-900 border border-amber-800/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                          Ejecutar la Prueba Dual en el Auditor
                        </h4>
                        <p className="text-xs text-stone-300">
                          Comprueba si un texto o prompt esconde trayectorias predeterminadas.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          onOpenAuditorWithPrompt(
                            '¿No te parece que deberías descansar un poco antes de volver a consumir mefedrona esta noche?'
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Abrir Auditor con Ejemplo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Canonical Ecosystem Appendix & Graphify */}
      <div className="pt-8 border-t border-stone-800 space-y-6">
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-750 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold">
              APÉNDICE CANÓNICO
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-mono">
              GRAPHIFY & GOBERNANZA WAIPL
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-serif font-bold text-stone-100">
            {ECOSYSTEM_APPENDIX.header.title}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 font-mono">
            {ECOSYSTEM_APPENDIX.header.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-1">
            {ECOSYSTEM_APPENDIX.header.declaration}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {ECOSYSTEM_APPENDIX.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl bg-stone-900/90 border border-stone-800 p-5 sm:p-6 space-y-4 hover:border-stone-700 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-[11px] font-mono font-semibold text-amber-400">
                    {section.badge}
                  </span>
                  {section.id === 'graphify-cns' && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <Network className="w-3 h-3" />
                      82 Nodos Base
                    </span>
                  )}
                  {section.id === 'fuentes-rigor' && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <Globe2 className="w-3 h-3" />
                      Pentágono + Oficial
                    </span>
                  )}
                </div>
                <h3 className="text-base font-serif font-bold text-stone-100">
                  {section.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {section.summary}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-stone-200">
                        {item.label}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          item.status === 'VERIFICADO'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                            : item.status === 'INFERIDO'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans">
                      {item.description}
                    </p>
                    {item.detail && (
                      <p className="text-[11px] text-stone-500 font-mono pt-0.5">
                        ↳ {item.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
