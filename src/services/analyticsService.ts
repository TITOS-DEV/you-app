import { db } from '@/lib/db';
import { isHabitDueOn, getLogsForDate, listActiveHabits } from '@/services/habitService';
import { getGlobalStreak } from '@/services/streakService';
import { getWaterHistory, getWaterTotalForDate } from '@/services/waterService';
import { calculateBmi, getAllWeightEntries, getWeightChange } from '@/services/weightService';
import { getTodayExerciseMinutes, getWeeklyExerciseMinutes } from '@/services/exerciseService';
import { currentWeekStart, dateKey, lastNDays, parseDateKey, todayKey } from '@/utils/date';
import type { DateKey, DayStatus, Habit, HabitLog } from '@/types';

export interface DailyCompletion {
  completed: number;
  total: number;
  pct: number;
}

export async function getDailyCompletion(date: DateKey = todayKey()): Promise<DailyCompletion> {
  const [habits, logs] = await Promise.all([listActiveHabits(), getLogsForDate(date)]);
  const due = habits.filter((h) => h.frequencyType !== 'weekly' && isHabitDueOn(h, parseDateKey(date)));
  if (due.length === 0) return { completed: 0, total: 0, pct: 0 };
  const logByHabit = new Map(logs.map((l) => [l.habitId, l]));
  let completed = 0;
  for (const habit of due) {
    const log = logByHabit.get(habit.id);
    if (!log || !log.completed) continue;
    if (habit.frequencyType === 'quantity' && habit.quantityTarget) {
      if ((log.quantityValue ?? 0) >= habit.quantityTarget) completed += 1;
    } else {
      completed += 1;
    }
  }
  return { completed, total: due.length, pct: Math.round((completed / due.length) * 100) };
}

export async function getWeeklyCompletion(from: Date = new Date()): Promise<number> {
  const start = currentWeekStart(from);
  const days = Array.from({ length: 7 }, (_, i) => dateKey(new Date(start.getTime() + i * 86_400_000)));
  const today = todayKey();
  const relevant = days.filter((d) => d <= today);
  if (relevant.length === 0) return 0;
  const results = await Promise.all(relevant.map((d) => getDailyCompletion(d)));
  const withHabits = results.filter((r) => r.total > 0);
  if (withHabits.length === 0) return 0;
  const avg = withHabits.reduce((sum, r) => sum + r.pct, 0) / withHabits.length;
  return Math.round(avg);
}

export async function getCurrentStreak(): Promise<number> {
  const streak = await getGlobalStreak();
  return streak.current;
}

export async function getLongestStreak(): Promise<number> {
  const streak = await getGlobalStreak();
  return streak.longest;
}

export async function getWaterAverage(days = 7): Promise<number> {
  const history = await getWaterHistory(days);
  if (history.length === 0) return 0;
  return Math.round(history.reduce((sum, d) => sum + d.ml, 0) / history.length);
}

export { getWeightChange };

export async function getExerciseMinutesToday(): Promise<number> {
  return getTodayExerciseMinutes();
}

export async function getExerciseMinutesWeek(): Promise<number> {
  return getWeeklyExerciseMinutes();
}

export async function getBMI(): Promise<number | undefined> {
  const [settings, entries] = await Promise.all([db.settings.get('settings'), getAllWeightEntries()]);
  const latest = entries.at(-1);
  if (!settings?.heightCm || !latest) return undefined;
  return calculateBmi(latest.weightKg, settings.heightCm);
}

export async function getBestDay(days = 7): Promise<{ date: DateKey; pct: number } | undefined> {
  const keys = lastNDays(days);
  const results = await Promise.all(keys.map(async (d) => ({ date: d, ...(await getDailyCompletion(d)) })));
  const withHabits = results.filter((r) => r.total > 0);
  if (withHabits.length === 0) return undefined;
  return withHabits.reduce((best, r) => (r.pct > best.pct ? r : best));
}

export async function getWorstDay(days = 7): Promise<{ date: DateKey; pct: number } | undefined> {
  const keys = lastNDays(days);
  const results = await Promise.all(keys.map(async (d) => ({ date: d, ...(await getDailyCompletion(d)) })));
  const withHabits = results.filter((r) => r.total > 0);
  if (withHabits.length === 0) return undefined;
  return withHabits.reduce((worst, r) => (r.pct < worst.pct ? r : worst));
}

export interface WeeklySummary {
  habitsPct: number;
  waterPct: number;
  exerciseMin: number;
  streak: number;
  weightChange?: number;
  conclusion: string;
}

export async function getWeeklySummary(): Promise<WeeklySummary> {
  const [habitsPct, waterHistory, exerciseMin, streak, weightChange, settings] = await Promise.all([
    getWeeklyCompletion(),
    getWaterHistory(7),
    getWeeklyExerciseMinutes(),
    getCurrentStreak(),
    getWeightChange(),
    db.settings.get('settings'),
  ]);
  const goal = settings?.waterGoalMl ?? 2000;
  const waterAvg = waterHistory.reduce((s, d) => s + d.ml, 0) / (waterHistory.length || 1);
  const waterPct = goal > 0 ? Math.round((waterAvg / goal) * 100) : 0;

  const conclusion =
    habitsPct >= 80
      ? 'Esta fue una de tus mejores semanas.'
      : habitsPct >= 50
        ? 'Semana estable. Vas construyendo consistencia.'
        : 'Semana difícil. Mañana es una nueva oportunidad.';

  return { habitsPct, waterPct, exerciseMin, streak, weightChange, conclusion };
}

export async function getDayStatus(date: DateKey): Promise<DayStatus> {
  // A day that hasn't happened yet can't be "incomplete" — that reads as a
  // missed day before the person ever had the chance to act on it.
  if (date > todayKey()) return 'empty';
  const completion = await getDailyCompletion(date);
  if (completion.total === 0) return 'empty';
  if (completion.pct >= 100) return 'complete';
  if (completion.pct > 0) return 'partial';
  return 'incomplete';
}

/** Weekday (0=Sunday..6=Saturday) completion rates over the last N weeks —
 * powers the Coach's "los miércoles estás completando menos" insight. */
export async function getWeekdayCompletionRates(weeks = 4): Promise<number[]> {
  const days = lastNDays(weeks * 7);
  const results = await Promise.all(days.map((d) => getDailyCompletion(d).then((c) => ({ d, c }))));
  const buckets: { sum: number; count: number }[] = Array.from({ length: 7 }, () => ({ sum: 0, count: 0 }));
  for (const { d, c } of results) {
    if (c.total === 0) continue;
    const weekday = parseDateKey(d).getDay();
    buckets[weekday].sum += c.pct;
    buckets[weekday].count += 1;
  }
  return buckets.map((b) => (b.count > 0 ? Math.round(b.sum / b.count) : -1));
}

export async function getHabitConsistency(habit: Habit, days = 30): Promise<number> {
  const keys = lastNDays(days);
  const logs = await db.habitLogs.where('habitId').equals(habit.id).toArray();
  const byDate = new Map<DateKey, HabitLog>(logs.map((l) => [l.date, l]));
  const createdKey = habit.createdAt.slice(0, 10);
  const dueKeys = keys.filter(
    (k) => k >= createdKey && (habit.frequencyType === 'weekly' || isHabitDueOn(habit, parseDateKey(k)))
  );
  if (dueKeys.length === 0) return 0;
  const done = dueKeys.filter((k) => byDate.get(k)?.completed).length;
  return Math.round((done / dueKeys.length) * 100);
}

export { getWaterTotalForDate };
