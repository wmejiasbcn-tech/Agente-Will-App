import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  Compass,
  Scale,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  FileText,
  Lock,
  Workflow,
  Eye,
} from 'lucide-react';
import { ConstitutionView } from './ConstitutionView';
import { PresenteView } from './PresenteView';
import { AuditorView } from './AuditorView';
import {
  CANONICAL_CORE_PRINCIPLE,
  CANONICAL_RISK_VS_HARM,
  CANONICAL_INFORMED_DECISION_ARCHITECTURE,
  CANONICAL_EPISTEMIC_HARNESS,
  HUMAN_EPISTEMIC_LABELS,
} from '../data/canonicalArchitectureData';

interface HowWillWorksViewProps {
  onNavigateToChat: (prompt?: string) => void;
  onOpenEmergency: () => void;
}

export const HowWillWorksView: React.FC<HowWillWorksViewProps> = ({
  onNavigateToChat,
  onOpenEmergency,
}) => {
  const [activeSection, setActiveSection] = useState<
    'principios' | 'constitucion' | 'presente' | 'auditor' | 'epistemologia' | 'riesgo-dano'
  >('principios');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-stone-100 font-sans">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-stone-800 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800">
            Transparencia & Gobernanza Ética
          </span>
          <span className="text-xs font-mono text-stone-400">ADN WAIPL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Cómo Funciona Will
        </h1>
        <p className="text-sm sm:text-base text-stone-400 max-w-3xl leading-relaxed">
          Will está regido por un marco constitucional inmutable de No Directividad Radical. Aquí
          puedes auditar los principios éticos, la Constitución WAIPL, las 8 dimensiones
          P.R.E.S.E.N.T.E. y el Auditor Constitucional que supervisa cada respuesta.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
        <button
          id="tab-btn-principios"
          onClick={() => setActiveSection('principios')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            activeSection === 'principios'
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Principios & Compromiso</span>
        </button>

        <button
          id="tab-btn-constitucion"
          onClick={() => setActiveSection('constitucion')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            activeSection === 'constitucion'
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Constitución WAIPL (8 Arts)</span>
        </button>

        <button
          id="tab-btn-presente"
          onClick={() => setActiveSection('presente')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            activeSection === 'presente'
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Marco P.R.E.S.E.N.T.E.</span>
        </button>

        <button
          id="tab-btn-auditor"
          onClick={() => setActiveSection('auditor')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            activeSection === 'auditor'
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Auditor Constitucional</span>
        </button>

        <button
          id="tab-btn-riesgo-dano"
          onClick={() => setActiveSection('riesgo-dano')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            activeSection === 'riesgo-dano'
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Riesgo ≠ Daño</span>
        </button>

        <button
          id="tab-btn-epistemologia"
          onClick={() => setActiveSection('epistemologia')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            activeSection === 'epistemologia'
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Arnés de Evidencia</span>
        </button>
      </div>

      {/* Section 1: Principios y Compromiso */}
      {activeSection === 'principios' && (
        <div className="space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-800/80 shadow-xl space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              El Principio Innegociable de Will
            </h2>
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/70 border border-amber-600/80 text-amber-100 font-serif text-base sm:text-lg italic leading-snug">
              {CANONICAL_CORE_PRINCIPLE.fundamentalMotto}
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              Will no es un terapeuta, ni un médico prescriptor, ni una herramienta de persuasión encubierta. Su propósito es ofrecer acompañamiento no directivo y rigor científico para que cada persona decida sobre su propia vida con total autonomía.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* What Will Does */}
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-emerald-900/40 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Lo que Will hace siempre:
              </span>
              <ul className="space-y-2 text-xs text-stone-300">
                {CANONICAL_CORE_PRINCIPLE.willDoes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What Will NEVER Does */}
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-rose-900/40 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Lo que Will NUNCA hace:
              </span>
              <ul className="space-y-2 text-xs text-stone-300">
                {CANONICAL_CORE_PRINCIPLE.willNeverDoes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Constitución WAIPL */}
      {activeSection === 'constitucion' && (
        <ConstitutionView
          onOpenAuditorWithPrompt={(prompt) => {
            setActiveSection('auditor');
          }}
        />
      )}

      {/* Section 3: Marco P.R.E.S.E.N.T.E. */}
      {activeSection === 'presente' && (
        <PresenteView
          onLaunchInDimension={(dim) => {
            onNavigateToChat(`Quiero explorar esto bajo la dimensión ${dim}`);
          }}
        />
      )}

      {/* Section 4: Auditor Constitucional */}
      {activeSection === 'auditor' && (
        <AuditorView
          onSendToChat={(prompt) => {
            onNavigateToChat(prompt);
          }}
        />
      )}

      {/* Section 5: Riesgo ≠ Daño */}
      {activeSection === 'riesgo-dano' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              {CANONICAL_RISK_VS_HARM.title}
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              {CANONICAL_RISK_VS_HARM.subtitle}
            </p>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                  {CANONICAL_RISK_VS_HARM.riskDefinition.title}
                </span>
                <p className="text-xs text-stone-200">
                  {CANONICAL_RISK_VS_HARM.riskDefinition.meaning}
                </p>
                <div className="text-[11px] font-mono text-amber-400 bg-stone-950/80 p-2 rounded-lg">
                  {CANONICAL_RISK_VS_HARM.riskDefinition.actionChain}
                </div>
                <p className="text-xs text-stone-400">
                  {CANONICAL_RISK_VS_HARM.riskDefinition.explanation}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 space-y-2">
                <span className="text-xs font-mono font-bold text-rose-300 uppercase">
                  {CANONICAL_RISK_VS_HARM.harmDefinition.title}
                </span>
                <p className="text-xs text-stone-200">
                  {CANONICAL_RISK_VS_HARM.harmDefinition.meaning}
                </p>
                <div className="text-[11px] font-mono text-rose-400 bg-stone-950/80 p-2 rounded-lg">
                  {CANONICAL_RISK_VS_HARM.harmDefinition.actionChain}
                </div>
                <p className="text-xs text-stone-400">
                  {CANONICAL_RISK_VS_HARM.harmDefinition.explanation}
                </p>
              </div>
            </div>

            {/* Metaphor */}
            <div className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
              <span className="font-serif font-bold text-stone-100 text-sm block">
                {CANONICAL_RISK_VS_HARM.metaphor.title}
              </span>
              <p className="text-xs text-stone-300 italic font-serif text-base text-amber-300">
                {CANONICAL_RISK_VS_HARM.metaphor.axiom}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-stone-300">
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  {CANONICAL_RISK_VS_HARM.metaphor.cliff}
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  {CANONICAL_RISK_VS_HARM.metaphor.gear}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 6: Arnés de Evidencia */}
      {activeSection === 'epistemologia' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              Arnés Epistemológico y Niveles de Certeza
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Will nunca presenta inferencias o especulaciones como si fueran hechos científicos comprobados. Cada afirmación técnica se rige por tres estados de certeza:
            </p>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                    1. Lo que sabemos
                  </span>
                </div>
                <p className="text-xs text-stone-200">
                  {HUMAN_EPISTEMIC_LABELS.VERIFICADO.humanDescription}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                    2. Lo que parece probable
                  </span>
                </div>
                <p className="text-xs text-stone-200">
                  {HUMAN_EPISTEMIC_LABELS.INFERIDO.humanDescription}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-700/60 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                  <span className="text-xs font-mono font-bold text-stone-300 uppercase">
                    3. Lo que todavía no sabemos
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  {HUMAN_EPISTEMIC_LABELS.DESCONOCIDO.humanDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
