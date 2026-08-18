import type { Timestamp } from './common';

export type PenaltyStatus = 'pending' | 'active' | 'completed' | 'skipped';

export type PenaltyReason = 'exercise' | 'reading' | 'water' | 'habit';

export interface Penalty {
  id: string;
  reason: PenaltyReason;
  habitId?: string;
  title: string;
  description: string;
  status: PenaltyStatus;
  streakLost: number;
  createdAt: Timestamp;
  completedAt?: Timestamp;
}
