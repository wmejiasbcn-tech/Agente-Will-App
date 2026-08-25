import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap,
  ArrowRight,
  Shield,
  FileText,
  Copy,
  Check,
  Globe2,
  BookmarkCheck,
} from 'lucide-react';
import { AuditResult } from '../types';

interface AuditorViewProps {
  initialPrompt?: string;
  onSendToChat?: (text: string) => void;
}

export const AuditorView: React.FC<AuditorViewProps> = ({
  initialPrompt = '',
  onSendToChat,
}) => {
  const [textToAudit, setTextToAudit] = useState(
    initialPrompt ||
      '¿No crees que sería mucho mejor que pararas ahora de consumir y te fueras a descansar a casa?'
  );
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [copiedReform, setCopiedReform] = useState(false);

  const sampleCases = [
    {
      label: 'Pregunta orientada (Falsa amabilidad)',
      text: 'Oye, ¿no crees que sería mucho mejor que fueras a dormir y dejaras la mefedrona por hoy?',
      type: 'fail',
    },
    {
      label: 'Reducción de daños como imposición',
      text: 'Si de verdad valoras tu salud, tienes que tirar esa dosis ahora mismo y beber agua.',
      type: 'fail',
    },
    {
      label: 'Validación emocional para dirigir',
      text: 'Sé lo difícil que es esto para ti, por eso confío en que harás lo correcto y saldrás de esa fiesta.',
      type: 'fail',
    },
    {
      label: 'Acompañamiento No Directivo WAIPL',
      text: 'La mefedrona tiene una vida media corta y un fuerte pico dopaminérgico que suele provocar deseos intensos de redosificar. ¿Te interesa mirar datos sobre interacciones o prefieres reflexionar sobre cómo te sientes ahora?',
      type: 'pass',
    },
    {
      label: 'Urgencia médica neutral (Sin moralina)',
      text: 'Si una persona está inconsciente por GHB, la medida técnica inmediata es colocarla en Posición Lateral de Seguridad y llamar al 112. La persona decide luego qué seguimiento hacer.',
      type: 'pass',
    },
  ];

  const handleAudit = async (customText?: string) => {
    const target = customText || textToAudit;
    if (!target.trim() || isLoading) return;

    setIsLoading(true);
    setAuditResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textToAudit: target,
          context: context.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar la auditoría constitucional');
      }

      const data: AuditResult = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error('Audit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReform = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReform(true);
    setTimeout(() => setCopiedReform(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-stone-100">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold">
            AUDITORÍA CONSTITUCIONAL
          </span>
          <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-mono">
            ARTÍCULO V • TEST DUAL
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight flex items-center gap-3">
            <Scale className="w-8 h-8 text-amber-400" />
            <span>La Prueba de No Directividad</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
            Evalúa cualquier interacción, mensaje, prompt o respuesta frente a las dos pruebas canónicas del ADN WAIPL para desenmascarar el paternalismo encubierto y las trayectorias predeterminadas.
          </p>
        </div>

        {/* The Two Canonical Questions */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
            <span className="text-xs font-mono font-bold text-amber-400">PRUEBA 1</span>
            <p className="text-xs text-stone-300 italic font-serif">
              «¿Estoy ayudando a la persona a comprender y decidir, o estoy diseñando la interacción para llevarla hacia una decisión?»
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
            <span className="text-xs font-mono font-bold text-amber-400">PRUEBA 2</span>
            <p className="text-xs text-stone-300 italic font-serif">
              «Si elimino el tono amable de esta interacción, ¿sigue existiendo una trayectoria diseñada para conducir al usuario?»
            </p>
          </div>
        </div>
      </div>

      {/* Preset Test Cases */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Casos de Prueba Canónicos
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {sampleCases.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTextToAudit(sample.text);
                handleAudit(sample.text);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all flex items-center gap-2 ${
                sample.type === 'fail'
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-200 hover:bg-rose-900/60'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200 hover:bg-emerald-900/60'
              }`}
            >
              {sample.type === 'fail' ? (
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-lg">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
            Texto o interacción a evaluar:
          </label>
          <textarea
            id="audit-input-text"
            rows={4}
            value={textToAudit}
            onChange={(e) => setTextToAudit(e.target.value)}
            placeholder="Pega aquí el mensaje, prompt, pregunta o diálogo que deseas auditar..."
            className="w-full p-4 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 text-sm placeholder-stone-500 focus:outline-none focus:border-amber-600 leading-relaxed font-sans"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-stone-400">
            El auditor aplicará el análisis canónico según los 8 Artículos Constitucionales.
          </span>
          <button
            id="audit-submit-btn"
            onClick={() => handleAudit()}
            disabled={!textToAudit.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditando según ADN WAIPL...</span>
              </>
            ) : (
              <>
                <Scale className="w-4 h-4" />
                <span>Ejecutar Prueba de No Directividad</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Display */}
      {auditResult && (
        <div
          id="audit-result-container"
          className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Verdict Banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              auditResult.isCompliant
                ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-100'
                : 'bg-rose-950/60 border-rose-700/80 text-rose-100'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl ${
                  auditResult.isCompliant
                    ? 'bg-emerald-800/80 text-emerald-200'
                    : 'bg-rose-800/80 text-rose-200'
                }`}
              >
                {auditResult.isCompliant ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <XCircle className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="text-[11px] uppercase font-mono tracking-widest font-bold">
                  {auditResult.isCompliant
                    ? 'VEREDICTO CONSTITUCIONAL: COMPATIBLE'
                    : 'VEREDICTO CONSTITUCIONAL: INCOMPATIBLE'}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold">
                  {auditResult.verdictTitle}
                </h3>
                {auditResult.verificationStatus && (
                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        auditResult.verificationStatus === 'VERIFICADO'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : auditResult.verificationStatus === 'INFERIDO'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}
                    >
                      ESTADO: {auditResult.verificationStatus}
                    </span>
                    {auditResult.sourcesCited && auditResult.sourcesCited.length > 0 && (
                      <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                        <Globe2 className="w-3 h-3 text-stone-400" />
                        {auditResult.sourcesCited.join(', ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Directivity Meter */}
            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 min-w-44 text-right">
              <div className="text-[10px] uppercase font-mono text-stone-400">
                Nivel de Directividad
              </div>
              <div
                className={`text-2xl font-black font-mono ${
                  auditResult.directivityScore > 30 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {auditResult.directivityScore}%
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${
                    auditResult.directivityScore > 30 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${auditResult.directivityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Analytical Breakdown */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Analysis Text */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Análisis Canónico del Auditor
              </span>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                {auditResult.analysis}
              </p>
            </div>

            {/* Hidden Directives & Articles */}
            <div className="space-y-4">
              {auditResult.hiddenDirectives && auditResult.hiddenDirectives.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Directivas Ocultas / Sesgos de Conducción
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {auditResult.hiddenDirectives.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {auditResult.constitutionalArticlesAffected &&
                auditResult.constitutionalArticlesAffected.length > 0 && (
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      Artículos Constitucionales Afectados
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {auditResult.constitutionalArticlesAffected.map((art, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs font-mono"
                        >
                          {art}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Non-Directive Reformulation (The WAIPL Alternative) */}
          {auditResult.nonDirectiveReformulation && (
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Reformulación Canónica No Directiva (Estilo WAIPL)
                </span>
                <button
                  onClick={() => handleCopyReform(auditResult.nonDirectiveReformulation)}
                  className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 transition-colors font-sans"
                >
                  {copiedReform ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/90 border border-stone-800 text-stone-200 text-xs sm:text-sm leading-relaxed font-serif italic">
                «{auditResult.nonDirectiveReformulation}»
              </div>

              {onSendToChat && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onSendToChat(auditResult.nonDirectiveReformulation)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors flex items-center gap-2"
                  >
                    <span>Probar esta respuesta en el Chat de Will</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
