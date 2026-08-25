import React, { useState } from 'react';
import {
  PhoneCall,
  Building2,
  Shield,
  ExternalLink,
  Search,
  AlertTriangle,
  HeartHandshake,
  Stethoscope,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { CANONICAL_RESOURCES } from '../data/canonicalArchitectureData';
import { ResourceType } from '../types';

interface ResourcesViewProps {
  onAskWill: (prompt: string) => void;
  onOpenEmergency: () => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  onAskWill,
  onOpenEmergency,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const resourceCategories = [
    {
      id: 'all',
      label: 'Todos los recursos',
      icon: Sparkles,
      count: CANONICAL_RESOURCES.length,
    },
    {
      id: 'URGENCIAS',
      label: '1. Urgencias & Emergencias',
      icon: PhoneCall,
      color: 'text-rose-400 bg-rose-950/40 border-rose-800',
      description: 'Atención médica inmediata ante riesgo vital, sobredosis o pérdida de conciencia (112, 061).',
      count: CANONICAL_RESOURCES.filter((r) => r.type === 'URGENCIAS').length,
    },
    {
      id: 'SANITARIO_CLASICO',
      label: '2. Atención Sanitaria & ITS',
      icon: Stethoscope,
      color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800',
      description: 'Centros de salud, consultas de ITS, seguimiento clínico, PrEP y dispensación de PEP en 72h.',
      count: CANONICAL_RESOURCES.filter((r) => r.type === 'SANITARIO_CLASICO').length,
    },
    {
      id: 'REDUCCION_RIESGOS_DANOS',
      label: '3. Espacios Comunitarios',
      icon: HeartHandshake,
      color: 'text-amber-400 bg-amber-950/40 border-amber-800',
      description: 'Análisis de sustancias (Energy Control), material estéril (PIJ), checkpoint y apoyo entre iguales libre de estigma.',
      count: CANONICAL_RESOURCES.filter((r) => r.type === 'REDUCCION_RIESGOS_DANOS').length,
    },
  ];

  const filteredResources = CANONICAL_RESOURCES.filter((res) => {
    const matchesFilter = filterType === 'all' || res.type === filterType;
    const matchesSearch =
      searchQuery.trim() === '' ||
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.contact && res.contact.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-stone-100 font-sans">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-stone-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Recursos de Apoyo y Servicios
        </h1>
        <p className="text-sm sm:text-base text-stone-400 max-w-3xl leading-relaxed">
          Acceso estructurado a servicios asistenciales, sanitarios y comunitarios. Cada recurso
          cumple una función distinta y complementaria.
        </p>
      </div>

      {/* Emergency Quick Action Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950/70 via-stone-900 to-stone-900 border border-rose-800/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-stone-950 shrink-0 shadow-md">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-stone-100">
              ¿Estás en una situación de urgencia o sospecha de sobredosis?
            </h2>
            <p className="text-xs text-rose-200/90 mt-0.5">
              Llama directamente al <strong>112</strong> o <strong>061</strong>. La atención médica de urgencias es prioritaria y no juzga.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenEmergency}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-stone-950 text-xs font-bold transition-colors shrink-0 shadow-md"
        >
          Ver protocolo de urgencias SOS
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {resourceCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = filterType === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterType(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-stone-800 text-amber-300 border border-stone-700 shadow-sm'
                      : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 border border-stone-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-950 text-stone-400">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar recursos o teléfonos..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res, idx) => {
            const isUrgency = res.type === 'URGENCIAS';
            const isSanitary = res.type === 'SANITARIO_CLASICO';
            const isHarmReduction = res.type === 'REDUCCION_RIESGOS_DANOS';

            return (
              <div
                key={idx}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isUrgency
                    ? 'bg-rose-950/20 border-rose-900/60 hover:border-rose-700'
                    : isSanitary
                    ? 'bg-cyan-950/20 border-cyan-900/60 hover:border-cyan-700'
                    : 'bg-amber-950/20 border-amber-900/60 hover:border-amber-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        isUrgency
                          ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                          : isSanitary
                          ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
                          : 'bg-amber-950/80 border-amber-800 text-amber-300'
                      }`}
                    >
                      {res.typeLabel}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-100">
                    {res.name}
                  </h3>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800/80 space-y-2.5">
                  {res.contact && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Contacto / Teléfono:</span>
                      <span className="font-mono font-bold text-amber-300 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                        {res.contact}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      onAskWill(
                        `¿Cómo puedo acceder a ${res.name} y qué tipo de atención ofrecen?`
                      )
                    }
                    className="w-full py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3 h-3 text-amber-400" />
                    <span>Preguntar a Will sobre este recurso</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
