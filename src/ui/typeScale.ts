export const WILL_TYPE_STEPS = ['a', 'a-plus', 'a-plus-plus', 'a-plus-plus-plus'] as const;
export type WillTypeStep = (typeof WILL_TYPE_STEPS)[number];

export const WILL_TYPE_LABEL: Record<WillTypeStep, string> = {
  a: 'A',
  'a-plus': 'A+',
  'a-plus-plus': 'A++',
  'a-plus-plus-plus': 'A+++',
};

const STORAGE_KEY = 'will-type-scale';

export function readWillTypeScale(): WillTypeStep {
  if (typeof localStorage === 'undefined') return 'a';
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '';
    return WILL_TYPE_STEPS.includes(raw as WillTypeStep) ? (raw as WillTypeStep) : 'a';
  } catch {
    return 'a';
  }
}

export function applyWillTypeScale(step: WillTypeStep) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-will-type', step);
  try {
    localStorage.setItem(STORAGE_KEY, step);
  } catch {
    /* ignore */
  }
}

export function cycleWillTypeScale(current: WillTypeStep): WillTypeStep {
  const i = WILL_TYPE_STEPS.indexOf(current);
  return WILL_TYPE_STEPS[(i + 1) % WILL_TYPE_STEPS.length];
}
