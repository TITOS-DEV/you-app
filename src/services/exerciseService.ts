import { db } from '@/lib/db';
import { createId } from '@/lib/utils';
import { currentWeekStart, dateKey, todayKey } from '@/utils/date';
import type { DateKey, ExerciseEntry, ExerciseType, Intensity } from '@/types';

export async function getExerciseEntriesForDate(date: DateKey): Promise<ExerciseEntry[]> {
  const entries = await db.exerciseEntries.where('date').equals(date).toArray();
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function logExercise(input: {
  type: ExerciseType;
  durationMin: number;
  intensity?: Intensity;
  note?: string;
  date?: DateKey;
}): Promise<ExerciseEntry> {
  const entry: ExerciseEntry = {
    id: createId(),
    date: input.date ?? todayKey(),
    type: input.type,
    durationMin: input.durationMin,
    intensity: input.intensity,
    note: input.note,
    createdAt: new Date().toISOString(),
  };
  await db.exerciseEntries.add(entry);
  return entry;
}

export async function deleteExerciseEntry(id: string): Promise<void> {
  await db.exerciseEntries.delete(id);
}

export async function getTodayExerciseMinutes(): Promise<number> {
  const entries = await getExerciseEntriesForDate(todayKey());
  return entries.reduce((sum, e) => sum + e.durationMin, 0);
}

export async function getWeeklyExerciseMinutes(from: Date = new Date()): Promise<number> {
  const start = dateKey(currentWeekStart(from));
  const end = todayKey();
  const all = await db.exerciseEntries.toArray();
  return all
    .filter((e) => e.date >= start && e.date <= end)
    .reduce((sum, e) => sum + e.durationMin, 0);
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const rest = min % 60;
  return rest === 0 ? `${h}h` : `${h}h ${rest}min`;
}
