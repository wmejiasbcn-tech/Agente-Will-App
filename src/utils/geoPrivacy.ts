const GEO_KEY_HINT =
  /(^|_)(lat|lng|lon|latitude|longitude|geolocation|coords|coordenad|ubicacion|ubicación|gps)(_|$)/i;

export function isGeoStorageKey(key: string): boolean {
  return GEO_KEY_HINT.test(key);
}

export function readGeoLeaksFromStorage(storage: {
  length: number;
  key: (i: number) => string | null;
  getItem: (k: string) => string | null;
}): string[] {
  const leaks: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key) continue;
    const value = storage.getItem(key) || '';
    if (isGeoStorageKey(key) || looksLikeCoordinates(value)) {
      leaks.push(key);
    }
  }
  return leaks;
}

export function looksLikeCoordinates(value: string): boolean {
  if (!value) return false;
  if (/"lat(itude)?"\s*:/.test(value) && /"(lng|lon|longitude)"\s*:/.test(value)) {
    return true;
  }
  return /\b-?\d{1,2}\.\d{3,},\s*-?\d{1,3}\.\d{3,}\b/.test(value);
}

export function assertNoGeoPersistence(): string[] {
  if (typeof window === 'undefined') return [];
  return [
    ...readGeoLeaksFromStorage(window.localStorage),
    ...readGeoLeaksFromStorage(window.sessionStorage),
  ];
}
