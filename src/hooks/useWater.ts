import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { todayKey } from '@/utils/date';
import { useSettings } from '@/hooks/useSettings';
import { mlToGlasses } from '@/services/waterService';

export function useWaterToday() {
  const settings = useSettings();
  const entries = useLiveQuery(() => db.waterEntries.where('date').equals(todayKey()).toArray(), []);
  const totalMl = (entries ?? []).reduce((sum, e) => sum + e.amountMl, 0);
  const goalMl = settings.waterGoalMl;
  const glasses = Math.round(mlToGlasses(totalMl, settings.glassSizeMl) * 10) / 10;
  const goalGlasses = Math.round(mlToGlasses(goalMl, settings.glassSizeMl));
  const pct = goalMl > 0 ? Math.min(100, Math.round((totalMl / goalMl) * 100)) : 0;
  return { entries: entries ?? [], totalMl, goalMl, glasses, goalGlasses, pct };
}
