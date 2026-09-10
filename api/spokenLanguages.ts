export interface SpokenLanguage {
  id: string;
  label: string;
}

export const SPOKEN_LANGUAGES: SpokenLanguage[] = [
  { id: 'es', label: 'Español' },
  { id: 'ca', label: 'Català' },
  { id: 'en', label: 'English' },
  { id: 'fr', label: 'Français' },
  { id: 'pt', label: 'Português' },
  { id: 'de', label: 'Deutsch' },
  { id: 'it', label: 'Italiano' },
  { id: 'ja', label: '日本語' },
  { id: 'zh', label: '中文' },
  { id: 'ko', label: '한국어' },
  { id: 'ar', label: 'العربية' },
  { id: 'ru', label: 'Русский' },
  { id: 'hi', label: 'हिन्दी' },
  { id: 'sw', label: 'Kiswahili' },
  { id: 'th', label: 'ไทย' },
  { id: 'vi', label: 'Tiếng Việt' },
  { id: 'id', label: 'Bahasa Indonesia' },
  { id: 'nl', label: 'Nederlands' },
  { id: 'pl', label: 'Polski' },
  { id: 'tr', label: 'Türkçe' },
];

export type LanguageFilterMode = 'prioritize' | 'only';

export type ResourceCategory = 'emergency' | 'health' | 'community' | 'other';

export function labelForLang(id: string) {
  return SPOKEN_LANGUAGES.find((l) => l.id === id)?.label || id;
}

export function extractLanguageLayers(tags: Record<string, string> | undefined): {
  nameLanguages: string[];
  careLanguages: string[];
} {
  const nameLanguages = new Set<string>();
  const careLanguages = new Set<string>();
  if (!tags) return { nameLanguages: [], careLanguages: [] };

  for (const key of Object.keys(tags)) {
    const named = key.match(/^name:([a-z]{2})$/);
    if (named) nameLanguages.add(named[1]);
    const spoken = key.match(/^language:([a-z]{2})$/);
    if (spoken) careLanguages.add(spoken[1]);
  }

  const listed = (tags.languages || tags.language || tags['contact:language'] || '')
    .toLowerCase()
    .split(/[;,/\s]+/)
    .map((s) => s.trim())
    .filter((s) => /^[a-z]{2}$/.test(s));
  listed.forEach((l) => careLanguages.add(l));

  const blob = `${tags.name || ''} ${tags.operator || ''}`.toLowerCase();
  if (/\binternational\b|\benglish[- ]speaking\b/.test(blob)) {
    careLanguages.add('en');
  }

  return {
    nameLanguages: [...nameLanguages],
    careLanguages: [...careLanguages],
  };
}

export function siteMatchesCareLanguages(
  careLanguages: string[],
  selected: string[],
): boolean {
  if (!selected.length) return true;
  return selected.some((l) => careLanguages.includes(l));
}

export function sortByCareLanguages<T extends { careLanguages: string[]; km: number }>(
  sites: T[],
  selected: string[],
  mode: LanguageFilterMode,
): T[] {
  if (!selected.length) return sites;
  const matched = sites.filter((s) => siteMatchesCareLanguages(s.careLanguages, selected));
  const rest = sites.filter((s) => !siteMatchesCareLanguages(s.careLanguages, selected));
  if (mode === 'only') return matched;
  const byKm = (a: T, b: T) => a.km - b.km;
  return [...matched.sort(byKm), ...rest.sort(byKm)];
}

export function nameInLanguages(
  tags: Record<string, string> | undefined,
  preferred: string[],
): string {
  if (!tags) return '';
  for (const lang of preferred) {
    const n = tags[`name:${lang}`];
    if (n) return n;
  }
  return tags.name || tags['name:en'] || tags['name:es'] || '';
}

/** @deprecated use extractLanguageLayers; kept for name-tag inspection in tests */
export function languagesFromOsmTags(tags: Record<string, string> | undefined): string[] {
  const layers = extractLanguageLayers(tags);
  return [...new Set([...layers.careLanguages, ...layers.nameLanguages])];
}

export function sortByLanguages<T extends { languages: string[]; km: number }>(
  sites: T[],
  selected: string[],
  mode: LanguageFilterMode,
): T[] {
  if (!selected.length) return sites;
  const matched = sites.filter((s) => selected.some((l) => s.languages.includes(l)));
  const rest = sites.filter((s) => !selected.some((l) => s.languages.includes(l)));
  if (mode === 'only') return matched;
  const byKm = (a: T, b: T) => a.km - b.km;
  return [...matched.sort(byKm), ...rest.sort(byKm)];
}
