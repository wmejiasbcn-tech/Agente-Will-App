import React from 'react';
import {
  MessageSquare,
  Compass,
  Building2,
  Shield,
  PhoneCall,
} from 'lucide-react';

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
      badge: '6 ÁREAS',
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
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                W
              </div>
              <div>
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

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-stone-800 text-amber-300 shadow-inner border border-stone-700'
                      : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              id="emergency-btn-header"
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-medium transition-colors shadow-sm"
              title="Atención médica urgente y teléfonos 112 / 061"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">SOS / Urgencias</span>
              <span className="sm:hidden">SOS</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary scrollable bar */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-stone-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-stone-800 text-amber-300 border border-stone-700 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
