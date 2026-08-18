import Dexie, { type EntityTable } from 'dexie';
import type {
  CoachMessage,
  DailySummary,
  ExerciseEntry,
  Habit,
  HabitLog,
  Penalty,
  RecoveryMission,
  Streak,
  UserSettings,
  WaterEntry,
  WeightEntry,
} from '@/types';

/**
 * YOU's entire data layer — local-first, offline-first. Everything lives in
 * IndexedDB on this one device, for the one person using the app. There is
 * no server and no account: `settings` is a singleton row, not a user table.
 */
export class YouDatabase extends Dexie {
  settings!: EntityTable<UserSettings, 'id'>;
  habits!: EntityTable<Habit, 'id'>;
  habitLogs!: EntityTable<HabitLog, 'id'>;
  waterEntries!: EntityTable<WaterEntry, 'id'>;
  weightEntries!: EntityTable<WeightEntry, 'id'>;
  exerciseEntries!: EntityTable<ExerciseEntry, 'id'>;
  streaks!: EntityTable<Streak, 'id'>;
  recoveryMissions!: EntityTable<RecoveryMission, 'id'>;
  penalties!: EntityTable<Penalty, 'id'>;
  coachMessages!: EntityTable<CoachMessage, 'id'>;
  dailySummaries!: EntityTable<DailySummary, 'id'>;

  constructor() {
    super('you-db');
    this.version(1).stores({
      settings: 'id',
      habits: 'id, archivedAt, sortOrder',
      habitLogs: 'id, habitId, date, [habitId+date]',
      waterEntries: 'id, date, createdAt',
      weightEntries: 'id, date, createdAt',
      exerciseEntries: 'id, date, type, createdAt',
      streaks: 'id, scope, habitId',
      recoveryMissions: 'id, streakId, completedAt',
      penalties: 'id, status, createdAt',
      coachMessages: 'id, type, answered, createdAt',
      dailySummaries: 'id, computedAt',
    });
  }
}

export const db = new YouDatabase();
