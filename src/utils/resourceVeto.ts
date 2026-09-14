const VETO_NAME =
  /gais\s*positius|gays?\s*positivos?|gaispositius/i;

export function isVetoedResource(name?: string, url?: string): boolean {
  const blob = `${name || ''} ${url || ''}`;
  if (!blob.trim()) return false;
  return VETO_NAME.test(blob);
}

export function isVetoedUrl(url?: string): boolean {
  if (!url) return false;
  return VETO_NAME.test(url);
}

export function scrubVetoedText(text: string): string {
  if (!text) return text;
  return text
    .replace(VETO_NAME, '')
    .replace(/https?:\/\/[^\s]*gaispositius[^\s]*/gi, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function rejectVetoedSites<T extends { name?: string; website?: string }>(
  sites: T[],
): T[] {
  return sites.filter((site) => !isVetoedResource(site.name, site.website));
}
