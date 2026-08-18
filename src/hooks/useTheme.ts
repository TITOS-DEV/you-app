import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

/** Applies the chosen theme (light / dark / system) to <html data-theme>,
 * keeping in sync with the OS preference when set to "system". */
export function useTheme(): void {
  const { theme } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    function apply() {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      root.setAttribute('data-theme', resolved);
      root.style.colorScheme = resolved;
      try {
        localStorage.setItem('you-theme', resolved);
      } catch {
        // best-effort cache for the pre-paint inline script only
      }
    }

    apply();
    if (theme === 'system') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
  }, [theme]);
}
