import React from 'react';
import { PhoneCall } from 'lucide-react';
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
    { id: 'chat', label: 'Hablar con Will' },
    { id: 'topics', label: 'Explorar Temas' },
    { id: 'resources', label: 'Recursos de Apoyo' },
    { id: 'how-it-works', label: 'Cómo funciona Will' },
  ];

  return (
    <header className="sticky top-0 z-40 will-nav text-[#f4efe6]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between min-h-14 py-2 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-3 text-left min-h-11"
            aria-label="Will, ir a Hablar con Will"
          >
            <OfficialBlason size={32} className="h-8 w-8 shrink-0" />
            <span className="font-serif text-[17px] tracking-[0.18em] text-[#f4efe6]">
              WILL
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7" aria-label="Principal">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-[12px] tracking-wide py-2 min-h-11 ${
                    isActive
                      ? 'will-nav-item-active'
                      : 'text-[#f4efe6]/48 hover:text-[#f4efe6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            id="emergency-btn-header"
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 min-h-11 px-2.5 py-1.5 text-[11px] tracking-wide text-[#e8c37a] hover:text-[#f4efe6]"
            title="Atención médica urgente y teléfonos 112 / 061"
            aria-haspopup="dialog"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        </div>

        <nav
          className="md:hidden flex items-center gap-5 py-1 overflow-x-auto no-scrollbar"
          aria-label="Principal móvil"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`nav-btn-mobile-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`text-[12px] whitespace-nowrap py-2 min-h-11 ${
                  isActive ? 'will-nav-item-active' : 'text-[#f4efe6]/45'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
