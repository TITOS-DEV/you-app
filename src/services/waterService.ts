import { db } from '@/lib/db';
import { createId } from '@/lib/utils';
import { lastNDays, todayKey } from '@/utils/date';
import type { DateKey, WaterEntry } from '@/types';

export async function getWaterEntriesForDate(date: DateKey): Promise<WaterEntry[]> {
  return db.waterEntries.where('date').equals(date).toArray();
}

export async function getWaterTotalForDate(date: DateKey): Promise<number> {
  const entries = await getWaterEntriesForDate(date);
  return entries.reduce((sum, e) => sum + e.amountMl, 0);
}

export async function addWater(amountMl: number, date: DateKey = todayKey()): Promise<WaterEntry> {
  const entry: WaterEntry = {
    id: createId(),
    date,
    amountMl,
    createdAt: new Date().toISOString(),
  };
  await db.waterEntries.add(entry);
  return entry;
}

export async function removeLastWaterEntry(date: DateKey = todayKey()): Promise<void> {
  const entries = (await getWaterEntriesForDate(date)).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const last = entries[0];
  if (last) await db.waterEntries.delete(last.id);
}

export async function deleteWaterEntry(id: string): Promise<void> {
  await db.waterEntries.delete(id);
}

/** Totals (ml) per day for the last N days, oldest first, zero-filled. */
export async function getWaterHistory(days: number): Promise<{ date: DateKey; ml: number }[]> {
  const keys = lastNDays(days);
  const all = await db.waterEntries.where('date').anyOf(keys).toArray();
  const byDate = new Map<DateKey, number>();
  for (const key of keys) byDate.set(key, 0);
  for (const entry of all) {
    byDate.set(entry.date, (byDate.get(entry.date) ?? 0) + entry.amountMl);
  }
  return keys.map((date) => ({ date, ml: byDate.get(date) ?? 0 }));
}

export function mlToGlasses(ml: number, glassSizeMl: number): number {
  if (glassSizeMl <= 0) return 0;
  return ml / glassSizeMl;
}

export function glassesToMl(glasses: number, glassSizeMl: number): number {
  return Math.round(glasses * glassSizeMl);
}
