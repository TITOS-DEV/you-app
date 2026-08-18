import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db } from '@/lib/db';
import { todayKey } from '@/utils/date';
import * as habitService from '@/services/habitService';
import * as streakService from '@/services/streakService';
import type { Habit, HabitLog } from '@/types';

export interface HabitWithToday {
  habit: Habit;
  log?: HabitLog;
  due: boolean;
}

export function useActiveHabits(): Habit[] {
  const habits = useLiveQuery(() => db.habits.toArray(), []);
  return (habits ?? [])
    .filter((h) => !h.archivedAt)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function useArchivedHabits(): Habit[] {
  const habits = useLiveQuery(() => db.habits.toArray(), []);
  return (habits ?? []).filter((h) => Boolean(h.archivedAt));
}

/** Today's habit list joined with today's logs, in display order. */
export function useHabitsToday(): HabitWithToday[] {
  const habits = useActiveHabits();
  const logs = useLiveQuery(() => db.habitLogs.where('date').equals(todayKey()).toArray(), []);
  const logByHabit = new Map((logs ?? []).map((l) => [l.habitId, l]));
  const today = new Date();
  return habits.map((habit) => ({
    habit,
    log: logByHabit.get(habit.id),
    due: habit.frequencyType === 'weekly' || habitService.isHabitDueOn(habit, today),
  }));
}

export function useHabitLogs(habitId: string): HabitLog[] {
  const logs = useLiveQuery(() => db.habitLogs.where('habitId').equals(habitId).toArray(), [habitId]);
  return (logs ?? []).sort((a, b) => a.date.localeCompare(b.date));
}

/** Toggling a habit also resyncs streaks so the UI reflects the new streak
 * immediately, without the caller needing to know that wiring exists. */
export function useToggleHabit() {
  return useCallback(async (habitId: string) => {
    await habitService.toggleHabitToday(habitId);
    await Promise.all([streakService.syncHabitStreak(habitId), streakService.syncGlobalStreak()]);
  }, []);
}

export function useSetHabitQuantity() {
  return useCallback(async (habitId: string, value: number, target: number) => {
    await habitService.setHabitCompletion(habitId, todayKey(), value >= target, value);
    await Promise.all([streakService.syncHabitStreak(habitId), streakService.syncGlobalStreak()]);
  }, []);
}
