import type { DateKey, Timestamp } from './common';

export interface DailySummary {
  /** the DateKey doubles as primary key */
  id: DateKey;
  habitsCompletionPct: number;
  habitsCompleted: number;
  habitsTotal: number;
  waterMl: number;
  waterGoalMl: number;
  exerciseMin: number;
  weightKg?: number;
  streakCount: number;
  computedAt: Timestamp;
}

export type DayStatus = 'complete' | 'partial' | 'incomplete' | 'empty';
