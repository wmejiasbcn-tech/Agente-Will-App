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

export function siteMatchesLanguages(
  siteLangs: string[],
  selected: string[],
): boolean {
  if (!selected.length) return true;
  return siteLangs.some((l) => selected.includes(l));
}

export function sortByLanguages<T extends { languages: string[]; km: number }>(
  sites: T[],
  selected: string[],
  mode: LanguageFilterMode,
): T[] {
  if (!selected.length) return sites;
  const matched = sites.filter((s) => siteMatchesLanguages(s.languages, selected));
  const rest = sites.filter((s) => !siteMatchesLanguages(s.languages, selected));
  if (mode === 'only') return matched;
  const byKm = (a: T, b: T) => a.km - b.km;
  return [...matched.sort(byKm), ...rest.sort(byKm)];
}

export function languagesFromOsmTags(tags: Record<string, string> | undefined): string[] {
  if (!tags) return [];
  const langs = new Set<string>();
  for (const key of Object.keys(tags)) {
    const named = key.match(/^name:([a-z]{2})$/);
    if (named) langs.add(named[1]);
    const spoken = key.match(/^language:([a-z]{2})$/);
    if (spoken) langs.add(spoken[1]);
  }
  const listed = (tags.languages || tags.language || '')
    .toLowerCase()
    .split(/[;,/\s]+/)
    .map((s) => s.trim())
    .filter((s) => /^[a-z]{2}$/.test(s));
  listed.forEach((l) => langs.add(l));
  const blob = Object.values(tags).join(' ').toLowerCase();
  if (/international|english|expat|gaijin/.test(blob)) langs.add('en');
  return [...langs];
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
