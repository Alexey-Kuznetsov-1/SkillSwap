export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'skillswap-theme';

export function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
}

export function getPreferredTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}
