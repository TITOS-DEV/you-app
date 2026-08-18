import { useCallback } from 'react';

type HapticPattern = 'light' | 'success' | 'warning';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  success: [10, 40, 10],
  warning: [20, 30, 20, 30],
};

/** Best-effort tactile feedback. Silently no-ops where the Vibration API
 * isn't available (Safari/iOS has no support) — never throws. */
export function useHaptics() {
  return useCallback((pattern: HapticPattern = 'light') => {
    try {
      navigator.vibrate?.(PATTERNS[pattern]);
    } catch {
      // haptics are a nicety, never worth surfacing an error for
    }
  }, []);
}
