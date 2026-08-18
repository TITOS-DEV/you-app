import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useGlobalStreak() {
  const streak = useLiveQuery(() => db.streaks.where('scope').equals('global').first(), []);
  return streak ?? { current: 0, longest: 0 };
}

export function useHabitStreak(habitId: string) {
  const streak = useLiveQuery(() => db.streaks.where({ scope: 'habit', habitId }).first(), [habitId]);
  return streak ?? { current: 0, longest: 0 };
}

export function useActiveRecoveryMission() {
  const streak = useGlobalStreak();
  const streakId = 'id' in streak ? streak.id : undefined;
  const mission = useLiveQuery(async () => {
    if (!streakId) return undefined;
    return db.recoveryMissions
      .where('streakId')
      .equals(streakId)
      .filter((m) => !m.completedAt)
      .first();
  }, [streakId]);
  return mission;
}

export function usePendingPenalty() {
  return useLiveQuery(async () => {
    const all = await db.penalties.toArray();
    return all
      .filter((p) => p.status === 'pending' || p.status === 'active')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }, []);
}
