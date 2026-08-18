import { todayKey } from '@/utils/date';

const DAILY_PHRASES = [
  'Hoy también cuenta.',
  'Un día más para mejorar.',
  'Pequeñas acciones. Grandes cambios.',
  'Tu constancia habla por ti.',
  'Vas construyendo algo real.',
  'Hoy puedes sumar un poco más.',
  'Sigue. Vas bien.',
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Stable per-day pick — the phrase shouldn't change on every re-render,
 * only once the calendar day changes. */
export function dailyPhrase(): string {
  const idx = hashString(todayKey()) % DAILY_PHRASES.length;
  return DAILY_PHRASES[idx];
}

export function dayProgressPhrase(pct: number): string {
  if (pct >= 100) return 'Día completo. Impecable.';
  if (pct >= 70) return 'Tu día va bien.';
  if (pct >= 40) return 'Vas a mitad de camino.';
  if (pct > 0) return 'Apenas comienzas. Aún hay tiempo.';
  return 'Hoy es un buen día para empezar.';
}
