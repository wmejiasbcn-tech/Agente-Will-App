import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Layers,
} from 'lucide-react';
import { PRESENTE_DIMENSIONS } from '../data/presenteData';
import { PresenteDimension } from '../types';

interface PresenteViewProps {
  onLaunchInDimension: (dimensionName: string) => void;
}

export const PresenteView: React.FC<PresenteViewProps> = ({ onLaunchInDimension }) => {
  const [selectedDimension, setSelectedDimension] = useState<PresenteDimension>(
    PRESENTE_DIMENSIONS[0]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-stone-100">
      {/* Header & Anti-Sequential Axiom */}
      <div className="rounded-3xl p-6 sm:p-8 bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold">
            ARQUITECTURA DE ACOMPAÑAMIENTO
          </span>
          <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-mono">
            8 DIMENSIONES NO LINEALES
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight flex items-center gap-3">
            <Compass className="w-8 h-8 text-amber-400" />
            <span>Marco P.R.E.S.E.N.T.E.</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
            Una arquitectura flexible subordinada al Principio de No Directividad. Diseñada para ofrecer distintos lentes de acogida, escucha y análisis sin imponer secuencias, estados finales ni barras de progreso.
          </p>
        </div>

        {/* The 5 "NO" Axioms */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-stone-300">
            <span className="text-rose-400 font-bold block mb-1">NO ES RUTA</span>
            Sin trayectorias fijas
          </div>
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-stone-300">
            <span className="text-rose-400 font-bold block mb-1">NO ES SECUENCIA</span>
            Salta libremente
          </div>
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-stone-300">
            <span className="text-rose-400 font-bold block mb-1">NO ES PROGRESO</span>
            Sin puntuaciones
          </div>
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-stone-300">
            <span className="text-rose-400 font-bold block mb-1">NO ES PROTOCOLO</span>
            Sin pasos obligados
          </div>
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-stone-300 col-span-2 sm:col-span-1">
            <span className="text-rose-400 font-bold block mb-1">NO TELEOLÓGICO</span>
            Sin estado final meta
          </div>
        </div>
      </div>

      {/* Grid of the 8 Dimensions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {PRESENTE_DIMENSIONS.map((dim, idx) => {
          const isSelected = selectedDimension.code === dim.code && selectedDimension.name === dim.name;
          return (
            <button
              key={`${dim.code}-${idx}`}
              onClick={() => setSelectedDimension(dim)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 h-28 relative group ${
                isSelected
                  ? 'bg-amber-950/80 border-amber-600 text-amber-100 shadow-lg scale-102 ring-1 ring-amber-500/50'
                  : 'bg-stone-900/90 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-2xl font-serif font-black ${
                    isSelected ? 'text-amber-300' : 'text-stone-400 group-hover:text-stone-200'
                  }`}
                >
                  {dim.letter}
                </span>
                <span className="text-[10px] font-mono opacity-60">0{idx + 1}</span>
              </div>
              <span className="text-xs font-semibold tracking-tight line-clamp-1">
                {dim.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Card of the Active Dimension */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-600/60 flex items-center justify-center text-amber-300 font-serif font-bold text-2xl">
              {selectedDimension.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                  {selectedDimension.name}
                </h2>
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-400 text-xs font-mono">
                  Dimensión P.R.E.S.E.N.T.E.
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
                {selectedDimension.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={() => onLaunchInDimension(selectedDimension.name)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Explorar con Will en esta dimensión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Concept */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Definición Conceptual
            </span>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              {selectedDimension.description}
            </p>
          </div>

          {/* Will Stance */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Postura de Will (No Directiva)
            </span>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              {selectedDimension.willStance}
            </p>
          </div>

          {/* User Sovereignty */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Soberanía Radical de la Persona
            </span>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              {selectedDimension.userSovereignty}
            </p>
          </div>
        </div>

        {/* Sample Non-Directive Formulations */}
        <div className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800/80 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Ejemplos de acompañamiento no directivo en esta dimensión:
          </span>
          <div className="grid sm:grid-cols-3 gap-2">
            {selectedDimension.sampleExplorations.map((sample, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 italic font-serif"
              >
                {sample}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
