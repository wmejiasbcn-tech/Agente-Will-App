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
} from 'lucide-react';
import { CONSTITUTIONAL_HEADER, CONSTITUTIONAL_ARTICLES } from '../data/constitutionalData';

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
          <h1 className="text-2xl sm:text-4xl font-serif font-bold will-copy tracking-tight">
            Cómo te acompaña Will
          </h1>

          <div className="p-4 sm:p-5 arch-glass font-serif text-base sm:text-xl italic leading-snug will-copy">
            «{CONSTITUTIONAL_HEADER.canonicalMotto}»
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
            placeholder="Buscar un principio..."
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
    </div>
  );
};
