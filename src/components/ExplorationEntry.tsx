import React from 'react';
import { MessageSquare, Search } from 'lucide-react';
import { ASK_WILL_FALLBACK, EntryPattern } from '../protocol/willEntry';

type Category = { id: string; label: string };

interface ExplorationEntryProps {
  pattern: EntryPattern;
  title: string;
  invitation: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  categories?: Category[];
  selectedCategoryId?: string | null;
  onSelectCategory?: (id: string) => void;
  searchedTerm?: string;
  emptyResults?: boolean;
  onAskWill: (prompt: string) => void;
  fallbackPrompt?: string;
  children?: React.ReactNode;
}

export const ExplorationEntry: React.FC<ExplorationEntryProps> = ({
  pattern,
  title,
  invitation,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Escribe lo que quieres explorar...',
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchedTerm,
  emptyResults,
  onAskWill,
  fallbackPrompt,
  children,
}) => {
  const showSearch = pattern === 'B' || pattern === 'C';
  const term = (searchedTerm ?? searchValue).trim();

  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5" data-entry-pattern={pattern}>
      <div className="space-y-2">
        <h2 className="font-serif text-xl sm:text-2xl will-copy">{title}</h2>
        <p className="text-sm sm:text-base will-copy">{invitation}</p>
      </div>

      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list">
          {categories.map((cat) => {
            const on = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="listitem"
                onClick={() => onSelectCategory?.(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs min-h-11 ${
                  on ? 'will-nav-item-active' : 'glass-panel text-[#ead6b4]/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {showSearch && onSearchChange && (
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-[#ead6b4]/45 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-3 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
            aria-label={searchPlaceholder}
          />
        </div>
      )}

      {children}

      {(emptyResults || pattern === 'C' || pattern === 'B') && (
        <p className="text-xs will-copy-muted pt-1">
          {emptyResults && term
            ? `No hemos encontrado resultados para «${term}». ${ASK_WILL_FALLBACK}`
            : ASK_WILL_FALLBACK}{' '}
          <button
            type="button"
            className="text-[#e8c37a] inline-flex items-center gap-1"
            onClick={() =>
              onAskWill(
                fallbackPrompt ||
                  (term
                    ? `No he encontrado «${term}» en el catálogo y quiero hablarlo con Will.`
                    : 'Quiero hablar con Will sobre algo que no está en el catálogo.'),
              )
            }
          >
            <MessageSquare className="w-3 h-3" />
            Decírselo a Will
          </button>
        </p>
      )}
    </section>
  );
};
