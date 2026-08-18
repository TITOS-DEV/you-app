import { db } from '@/lib/db';
import { createId } from '@/lib/utils';
import { dateKey as toDateKey, todayKey } from '@/utils/date';
import type { DateKey, Habit, HabitLog, NewHabit } from '@/types';

export async function listActiveHabits(): Promise<Habit[]> {
  const all = await db.habits.toArray();
  return all
    .filter((h) => !h.archivedAt)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listArchivedHabits(): Promise<Habit[]> {
  const all = await db.habits.toArray();
  return all.filter((h) => Boolean(h.archivedAt));
}

/** A habit is "due" on a given day depending on its frequency type. Quantity
 * and daily habits are due every day; weekly habits are always shown so
 * progress toward the weekly target stays visible. A habit is never due
 * before it existed — otherwise every day prior to a habit's creation
 * would read as a missed day in streaks and the calendar. */
export function isHabitDueOn(habit: Habit, date: Date): boolean {
  const createdKey = toDateKey(new Date(habit.createdAt));
  if (toDateKey(date) < createdKey) return false;

  switch (habit.frequencyType) {
    case 'daily':
    case 'weekly':
    case 'quantity':
      return true;
    case 'specificDays':
      return (habit.specificDays ?? []).includes(date.getDay());
  }
}

export async function createHabit(input: NewHabit): Promise<Habit> {
  const count = await db.habits.count();
  const habit: Habit = {
    ...input,
    id: createId(),
    sortOrder: count,
    createdAt: new Date().toISOString(),
  };
  await db.habits.add(habit);
  await db.streaks.add({
    id: createId(),
    scope: 'habit',
    habitId: habit.id,
    current: 0,
    longest: 0,
    updatedAt: new Date().toISOString(),
  });
  return habit;
}

export async function updateHabit(id: string, changes: Partial<Habit>): Promise<void> {
  await db.habits.update(id, changes);
}

export async function archiveHabit(id: string): Promise<void> {
  await db.habits.update(id, { archivedAt: new Date().toISOString() });
}

export async function restoreHabit(id: string): Promise<void> {
  await db.habits.update(id, { archivedAt: undefined });
}

export async function deleteHabit(id: string): Promise<void> {
  await db.transaction('rw', db.habits, db.habitLogs, db.streaks, async () => {
    await db.habits.delete(id);
    await db.habitLogs.where('habitId').equals(id).delete();
    await db.streaks.where('habitId').equals(id).delete();
  });
}

export async function getLogsForDate(date: DateKey): Promise<HabitLog[]> {
  return db.habitLogs.where('date').equals(date).toArray();
}

export async function getLogForHabitOnDate(
  habitId: string,
  date: DateKey
): Promise<HabitLog | undefined> {
  return db.habitLogs.where({ habitId, date }).first();
}

export async function getLogsForHabit(habitId: string): Promise<HabitLog[]> {
  const logs = await db.habitLogs.where('habitId').equals(habitId).toArray();
  return logs.sort((a, b) => a.date.localeCompare(b.date));
}

/** Toggles a boolean habit's completion for a date, or sets a quantity
 * habit's progress value. Returns the resulting log. */
export async function setHabitCompletion(
  habitId: string,
  date: DateKey,
  completed: boolean,
  quantityValue?: number
): Promise<HabitLog> {
  const existing = await getLogForHabitOnDate(habitId, date);
  if (existing) {
    const updated: HabitLog = {
      ...existing,
      completed,
      quantityValue,
      completedAt: new Date().toISOString(),
    };
    await db.habitLogs.put(updated);
    return updated;
  }
  const log: HabitLog = {
    id: createId(),
    habitId,
    date,
    completed,
    quantityValue,
    completedAt: new Date().toISOString(),
  };
  await db.habitLogs.add(log);
  return log;
}

export async function toggleHabitToday(habitId: string): Promise<HabitLog> {
  const date = todayKey();
  const existing = await getLogForHabitOnDate(habitId, date);
  return setHabitCompletion(habitId, date, !existing?.completed);
}

export async function reorderHabits(orderedIds: string[]): Promise<void> {
  await db.transaction('rw', db.habits, async () => {
    await Promise.all(
      orderedIds.map((id, index) => db.habits.update(id, { sortOrder: index }))
    );
  });
}
