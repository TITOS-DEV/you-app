import type { DateKey, Timestamp } from './common';

/**
 * Streak tracking. `scope === 'global'` tracks the overall daily-discipline
 * streak (all core habits done); `scope === 'habit'` tracks one habit.
 */
export interface Streak {
  id: string;
  scope: 'global' | 'habit';
  habitId?: string;
  current: number;
  longest: number;
  lastCompletedDate?: DateKey;
  /** set while a recovery mission is active, see RecoveryMission */
  updatedAt: Timestamp;
}

export interface RecoveryMission {
  id: string;
  streakId: string;
  previousStreak: number;
  targetConsecutiveDays: number;
  progressDays: number;
  startedAt: Timestamp;
  completedAt?: Timestamp;
}
