import { db } from '@/lib/db';
import { createId } from '@/lib/utils';
import { dateKey, parseDateKey, subDays, todayKey } from '@/utils/date';
import { isHabitDueOn } from '@/services/habitService';
import { createPenaltyForStreakLoss } from '@/services/penaltyService';
import type { DateKey, Habit, HabitLog, Streak } from '@/types';

const LOOKBACK_DAYS = 400;

/** Whether a given day counts as "complete" for streak purposes:
 * every habit due that day (daily / specific-days / quantity — weekly
 * habits aren't daily-gated) has a completed log.
 * Returns `null` when there was nothing due, so the day is neutral: it
 * neither extends nor breaks a streak. */
function dayCompletion(date: Date, habits: Habit[], logsByHabitDate: Map<string, HabitLog>): boolean | null {
  const due = habits.filter(
    (h) => h.frequencyType !== 'weekly' && isHabitDueOn(h, date)
  );
  if (due.length === 0) return null;
  const key = dateKey(date);
  return due.every((h) => {
    const log = logsByHabitDate.get(`${h.id}|${key}`);
    if (!log || !log.completed) return false;
    if (h.frequencyType === 'quantity' && h.quantityTarget) {
      return (log.quantityValue ?? 0) >= h.quantityTarget;
    }
    return true;
  });
}

function buildLogIndex(logs: HabitLog[]): Map<string, HabitLog> {
  const map = new Map<string, HabitLog>();
  for (const log of logs) map.set(`${log.habitId}|${log.date}`, log);
  return map;
}

interface StreakResult {
  current: number;
  longest: number;
  lastCompletedDate?: DateKey;
}

function computeStreak(habits: Habit[], logs: HabitLog[], earliestDate?: DateKey): StreakResult {
  const logIndex = buildLogIndex(logs);
  const today = new Date();
  const oldestPossible = earliestDate ? parseDateKey(earliestDate) : subDays(today, LOOKBACK_DAYS);

  // Walk backward from today, skipping neutral days, until we hit an
  // incomplete day. Today itself only counts once it's actually complete —
  // an unfinished "today" doesn't break yesterday's streak.
  let current = 0;
  let cursor = new Date(today);
  const todayResult = dayCompletion(cursor, habits, logIndex);
  if (todayResult === true) {
    current += 1;
  }
  cursor = subDays(cursor, 1);
  while (cursor >= oldestPossible) {
    const result = dayCompletion(cursor, habits, logIndex);
    if (result === true) {
      current += 1;
    } else if (result === false) {
      break;
    }
    // neutral (null) days are skipped without breaking the run
    cursor = subDays(cursor, 1);
  }

  // Longest streak: scan the whole window for the best run.
  let longest = 0;
  let run = 0;
  cursor = new Date(oldestPossible);
  let lastCompletedDate: DateKey | undefined;
  while (cursor <= today) {
    const result = dayCompletion(cursor, habits, logIndex);
    if (result === true) {
      run += 1;
      longest = Math.max(longest, run);
      lastCompletedDate = dateKey(cursor);
    } else if (result === false) {
      run = 0;
    }
    cursor = subDays(cursor, -1);
  }
  longest = Math.max(longest, current);

  return { current, longest, lastCompletedDate };
}

export async function getGlobalStreak(): Promise<Streak> {
  const existing = await db.streaks.where('scope').equals('global').first();
  if (existing) return existing;
  const created: Streak = {
    id: createId(),
    scope: 'global',
    current: 0,
    longest: 0,
    updatedAt: new Date().toISOString(),
  };
  await db.streaks.add(created);
  return created;
}

export async function getHabitStreak(habitId: string): Promise<Streak | undefined> {
  return db.streaks.where({ scope: 'habit', habitId }).first();
}

/** Recomputes the global streak from full history and persists it. If the
 * streak just broke (previously > 0, now back to 0), records a Penalty and
 * opens a RecoveryMission so the person has a clear path back. */
export async function syncGlobalStreak(): Promise<Streak> {
  const [habits, logs, streak] = await Promise.all([
    db.habits.toArray(),
    db.habitLogs.toArray(),
    getGlobalStreak(),
  ]);
  const active = habits.filter((h) => !h.archivedAt);
  const result = computeStreak(active, logs);

  const brokeToday = streak.current > 0 && result.current === 0;

  const updated: Streak = {
    ...streak,
    current: result.current,
    longest: Math.max(streak.longest, result.longest),
    lastCompletedDate: result.lastCompletedDate,
    updatedAt: new Date().toISOString(),
  };
  await db.streaks.put(updated);

  if (brokeToday && streak.current >= 1) {
    await createPenaltyForStreakLoss(streak.id, streak.current);
    await startRecoveryMission(streak.id, streak.current);
  } else if (
    result.lastCompletedDate === todayKey() &&
    streak.lastCompletedDate !== todayKey()
  ) {
    // today just became complete for the first time — count it toward any
    // active recovery mission.
    await advanceRecoveryMission(streak.id);
  }

  return updated;
}

export async function syncHabitStreak(habitId: string): Promise<Streak> {
  const [habit, logs, streak] = await Promise.all([
    db.habits.get(habitId),
    db.habitLogs.where('habitId').equals(habitId).toArray(),
    getHabitStreak(habitId),
  ]);
  if (!habit) throw new Error('Habit not found');
  const result = computeStreak([habit], logs, habit.createdAt.slice(0, 10));

  const base: Streak =
    streak ??
    ({
      id: createId(),
      scope: 'habit',
      habitId,
      current: 0,
      longest: 0,
      updatedAt: new Date().toISOString(),
    } satisfies Streak);

  const updated: Streak = {
    ...base,
    current: result.current,
    longest: Math.max(base.longest, result.longest),
    lastCompletedDate: result.lastCompletedDate,
    updatedAt: new Date().toISOString(),
  };
  await db.streaks.put(updated);
  return updated;
}

const RECOVERY_TARGET_DAYS = 3;

export async function startRecoveryMission(streakId: string, previousStreak: number) {
  const existing = await getActiveRecoveryMission(streakId);
  if (existing) return existing;
  const mission = {
    id: createId(),
    streakId,
    previousStreak,
    targetConsecutiveDays: RECOVERY_TARGET_DAYS,
    progressDays: 0,
    startedAt: new Date().toISOString(),
  };
  await db.recoveryMissions.add(mission);
  return mission;
}

export async function getActiveRecoveryMission(streakId: string) {
  return db.recoveryMissions
    .where('streakId')
    .equals(streakId)
    .filter((m) => !m.completedAt)
    .first();
}

export async function advanceRecoveryMission(streakId: string): Promise<void> {
  const mission = await getActiveRecoveryMission(streakId);
  if (!mission) return;
  const streak = await db.streaks.get(streakId);
  if (!streak) return;

  const progressDays = Math.min(mission.progressDays + 1, mission.targetConsecutiveDays);
  const completedNow = progressDays >= mission.targetConsecutiveDays;
  await db.recoveryMissions.update(mission.id, {
    progressDays,
    completedAt: completedNow ? new Date().toISOString() : undefined,
  });
}

export { todayKey };
