import React from 'react';
import { X, AlertTriangle, Phone, Activity, Heart, ShieldAlert } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-stone-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-rose-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-900/80 border border-rose-700/60 flex items-center justify-center text-rose-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-rose-200">
                Información de Urgencia y Emergencias
              </h2>
              <p className="text-xs text-rose-300/80">
                Datos objetivos de primeros auxilios y contacto rápido sin juicio
              </p>
            </div>
          </div>
          <button
            id="close-emergency-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Quick Call Box */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono text-stone-400">Emergencias Generales (UE / España)</span>
                <p className="text-xl font-bold text-amber-400 font-mono">112</p>
                <p className="text-[11px] text-stone-400">Ambulancia, bomberos y urgencias médicas</p>
              </div>
              <Phone className="w-6 h-6 text-amber-500/80" />
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono text-stone-400">Instituto Nac. Toxicología</span>
                <p className="text-xl font-bold text-amber-400 font-mono">91 562 04 20</p>
                <p className="text-[11px] text-stone-400">Atención médica 24h por intoxicaciones</p>
              </div>
              <Activity className="w-6 h-6 text-amber-500/80" />
            </div>
          </div>

          {/* Posición Lateral de Seguridad (PLS) */}
          <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>Persona inconsciente que respira: Posición Lateral de Seguridad (PLS)</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Si alguien pierde la consciencia (ej. G-out por GHB) pero respira, colócala inmediatamente de lado para evitar que se asfixie con su propio vómito o lengua:
            </p>
            <ol className="list-decimal list-inside text-xs text-stone-300 space-y-1.5 pl-1">
              <li>Coloca el brazo más cercano a ti en ángulo recto con la palma hacia arriba.</li>
              <li>Cruza el otro brazo sobre su pecho y apoya el dorso de su mano contra su mejilla contraria.</li>
              <li>Flexiona la pierna más alejada y tira de ella para girar el cuerpo hacia ti.</li>
              <li>Inclina ligeramente la cabeza hacia atrás para mantener la vía aérea despejada.</li>
              <li><strong>Jamás dejes sola a una persona inconsciente.</strong> Llama al 112 si la respiración es lenta (menos de 8-10 respiraciones por minuto) o discontinua.</li>
            </ol>
          </div>

          {/* Signos de Alarma Críticos */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Signos que requieren atención médica urgente
            </h3>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-stone-300">
              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800">
                <strong className="text-stone-200 block mb-1">Sospecha de Sobredosis / G-out</strong>
                Respiración jadeante, labios azulados, falta de respuesta al dolor o estímulo verbal, rigidez mandibular extrema.
              </div>
              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800">
                <strong className="text-stone-200 block mb-1">Síndrome Serotoninérgico / Hipertermia</strong>
                Fiebre muy alta, sudoración profusa, temblores incontrolables, rigidez muscular, desorientación o convulsiones.
              </div>
              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800">
                <strong className="text-stone-200 block mb-1">Cardiovascular</strong>
                Dolor opresivo en el pecho que se extiende al brazo o mandíbula, dificultad severa para respirar, desmayo repentino.
              </div>
              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800">
                <strong className="text-stone-200 block mb-1">PEP (Profilaxis Post-Exposición)</strong>
                Si hubo rotura de condón o práctica de riesgo con sangre sin PrEP, acudir a Urgencias de un hospital antes de 72h (idealmente antes de 24h).
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-400">
          <span>Los servicios médicos de urgencias no juzgan ni sancionan. La prioridad es la salud.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
