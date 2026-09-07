import React from 'react';
import {
  MessageSquare,
  Compass,
  Building2,
  Shield,
  PhoneCall,
} from 'lucide-react';
import { OfficialBlason } from './OfficialBlason';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
}) => {
  const navItems = [
    {
      id: 'chat',
      label: 'Hablar con Will',
      badge: 'CHAT',
      icon: MessageSquare,
    },
    {
      id: 'topics',
      label: 'Explorar Temas',
      badge: '7 ÁREAS',
      icon: Compass,
    },
    {
      id: 'resources',
      label: 'Recursos de Apoyo',
      badge: 'SERVICIOS',
      icon: Building2,
    },
    {
      id: 'how-it-works',
      label: 'Cómo funciona Will',
      badge: 'TRANSPARENCIA',
      icon: Shield,
    },
  ];

  return (
    <header className="sticky top-0 z-40 will-nav text-[#f4efe6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2">
          {/* Identidad: blasón oficial flotando en negro mate, sin contenedor */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-3 text-left rounded-xl group"
              aria-label="Will, ir a Hablar con Will"
            >
              <OfficialBlason size={40} className="h-10 w-10 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold tracking-wide text-stone-100">
                    WILL
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800">
                    Acompañamiento
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 font-sans tracking-tight hidden sm:block">
                  Espacio confidencial, riguroso y sin juicios
                </p>
              </div>
            </button>
          </div>

          <nav
            className="hidden md:flex items-center gap-1.5"
            aria-label="Principal"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2.5 min-h-11 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'will-nav-item-active'
                      : 'text-[#f4efe6]/70 hover:text-[#f4efe6] hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-[#e8c37a]' : 'text-[#f4efe6]/50'}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="emergency-btn-header"
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 min-h-11 px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-medium transition-colors"
              title="Atención médica urgente y teléfonos 112 / 061"
              aria-haspopup="dialog"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">SOS / Urgencias</span>
              <span className="sm:hidden">SOS</span>
            </button>
          </div>
        </div>

        <nav
          className="md:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-[rgba(232,195,122,0.1)]"
          aria-label="Principal móvil"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`nav-btn-mobile-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3 py-2.5 min-h-11 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'will-nav-item-active font-semibold'
                    : 'text-[#f4efe6]/60 hover:text-[#f4efe6] hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
