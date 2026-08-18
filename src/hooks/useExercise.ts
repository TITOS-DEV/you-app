import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { currentWeekStart, dateKey, todayKey } from '@/utils/date';

export function useExerciseToday() {
  const entries = useLiveQuery(
    () => db.exerciseEntries.where('date').equals(todayKey()).toArray(),
    []
  );
  const minutes = (entries ?? []).reduce((sum, e) => sum + e.durationMin, 0);
  return { entries: entries ?? [], minutes };
}

export function useExerciseWeek() {
  const start = dateKey(currentWeekStart());
  const end = todayKey();
  const entries = useLiveQuery(
    () => db.exerciseEntries.where('date').between(start, end, true, true).toArray(),
    [start, end]
  );
  const minutes = (entries ?? []).reduce((sum, e) => sum + e.durationMin, 0);
  return { entries: entries ?? [], minutes };
}
