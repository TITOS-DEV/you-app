import { db } from '@/lib/db';
import { createId } from '@/lib/utils';
import { daysAgo, todayKey } from '@/utils/date';
import type { BmiCategory, DateKey, WeightEntry, WeightRange } from '@/types';

export async function getAllWeightEntries(): Promise<WeightEntry[]> {
  const entries = await db.weightEntries.toArray();
  return entries.sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
}

export async function getLatestWeightEntry(): Promise<WeightEntry | undefined> {
  const entries = await getAllWeightEntries();
  return entries.at(-1);
}

export async function logWeight(
  weightKg: number,
  date: DateKey = todayKey(),
  time?: string
): Promise<WeightEntry> {
  const entry: WeightEntry = {
    id: createId(),
    date,
    time,
    weightKg,
    createdAt: new Date().toISOString(),
  };
  await db.weightEntries.add(entry);
  return entry;
}

export async function deleteWeightEntry(id: string): Promise<void> {
  await db.weightEntries.delete(id);
}

const RANGE_DAYS: Record<Exclude<WeightRange, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '3m': 90,
  '6m': 180,
};

export async function getWeightHistory(range: WeightRange): Promise<WeightEntry[]> {
  const all = await getAllWeightEntries();
  if (range === 'all') return all;
  const cutoff = daysAgo(RANGE_DAYS[range]);
  return all.filter((e) => e.date >= cutoff);
}

/** Change vs. the entry immediately before the current one (most recent
 * two logs), not vs. the range window — that's what "-0.8 kg" means to a
 * person tracking day to day. */
export async function getWeightChange(): Promise<number | undefined> {
  const all = await getAllWeightEntries();
  if (all.length < 2) return undefined;
  const latest = all.at(-1)!;
  const prev = all.at(-2)!;
  return Math.round((latest.weightKg - prev.weightKg) * 10) / 10;
}

export function calculateBmi(weightKg: number, heightCm: number): number | undefined {
  if (!weightKg || !heightCm) return undefined;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'bajo peso';
  if (bmi < 25) return 'peso saludable';
  if (bmi < 30) return 'sobrepeso';
  return 'obesidad';
}
