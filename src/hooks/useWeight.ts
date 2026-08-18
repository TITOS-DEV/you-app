import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useSettings } from '@/hooks/useSettings';
import { calculateBmi } from '@/services/weightService';

export function useWeightEntries() {
  const entries = useLiveQuery(
    () => db.weightEntries.toArray().then((e) => e.sort((a, b) => a.date.localeCompare(b.date))),
    []
  );
  return entries ?? [];
}

export function useLatestWeight() {
  const entries = useWeightEntries();
  return entries.at(-1);
}

export function useWeightChange() {
  const entries = useWeightEntries();
  if (entries.length < 2) return undefined;
  const latest = entries.at(-1)!;
  const prev = entries.at(-2)!;
  return Math.round((latest.weightKg - prev.weightKg) * 10) / 10;
}

export function useBmi() {
  const settings = useSettings();
  const latest = useLatestWeight();
  if (!settings.heightCm || !latest) return undefined;
  return calculateBmi(latest.weightKg, settings.heightCm);
}
