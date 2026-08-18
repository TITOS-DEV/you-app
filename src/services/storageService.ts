import { z } from 'zod';
import type { Table } from 'dexie';
import { db } from '@/lib/db';
import { dateKey } from '@/utils/date';
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

/** Restores a backup array of loosely-typed records into a Dexie table. The
 * shape was already checked by `backupSchema`; this only bridges the
 * `unknown` boundary at the storage layer. */
function bulkAddUnknown<T>(table: Table<T>, rows: Record<string, unknown>[]): Promise<unknown> {
  return table.bulkAdd(rows as unknown as T[]);
}

const BACKUP_VERSION = 1;

/** The backup as YOU actually writes it — real entity types, for export. */
export interface Backup {
  version: number;
  exportedAt: string;
  data: {
    settings: UserSettings[];
    habits: Habit[];
    habitLogs: HabitLog[];
    waterEntries: WaterEntry[];
    weightEntries: WeightEntry[];
    exerciseEntries: ExerciseEntry[];
    streaks: Streak[];
    recoveryMissions: RecoveryMission[];
    penalties: Penalty[];
    coachMessages: CoachMessage[];
    dailySummaries: DailySummary[];
  };
}

/** Loose but real validation — enough to reject garbage/corrupted imports
 * without hand-maintaining a schema per entity shape change. Used only on
 * the import path, where the file's contents are genuinely `unknown`. */
const backupSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  data: z.object({
    settings: z.array(z.record(z.string(), z.unknown())),
    habits: z.array(z.record(z.string(), z.unknown())),
    habitLogs: z.array(z.record(z.string(), z.unknown())),
    waterEntries: z.array(z.record(z.string(), z.unknown())),
    weightEntries: z.array(z.record(z.string(), z.unknown())),
    exerciseEntries: z.array(z.record(z.string(), z.unknown())),
    streaks: z.array(z.record(z.string(), z.unknown())),
    recoveryMissions: z.array(z.record(z.string(), z.unknown())),
    penalties: z.array(z.record(z.string(), z.unknown())),
    coachMessages: z.array(z.record(z.string(), z.unknown())),
    dailySummaries: z.array(z.record(z.string(), z.unknown())),
  }),
});

export type BackupPayload = z.infer<typeof backupSchema>;

export async function buildBackup(): Promise<Backup> {
  const [
    settings,
    habits,
    habitLogs,
    waterEntries,
    weightEntries,
    exerciseEntries,
    streaks,
    recoveryMissions,
    penalties,
    coachMessages,
    dailySummaries,
  ] = await Promise.all([
    db.settings.toArray(),
    db.habits.toArray(),
    db.habitLogs.toArray(),
    db.waterEntries.toArray(),
    db.weightEntries.toArray(),
    db.exerciseEntries.toArray(),
    db.streaks.toArray(),
    db.recoveryMissions.toArray(),
    db.penalties.toArray(),
    db.coachMessages.toArray(),
    db.dailySummaries.toArray(),
  ]);

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      settings,
      habits,
      habitLogs,
      waterEntries,
      weightEntries,
      exerciseEntries,
      streaks,
      recoveryMissions,
      penalties,
      coachMessages,
      dailySummaries,
    },
  };
}

export function backupFileName(): string {
  return `you-backup-${dateKey()}.json`;
}

/** Triggers a browser download of the given JSON-serializable payload. */
export function downloadJson(filename: string, payload: unknown): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportBackup(): Promise<void> {
  const payload = await buildBackup();
  downloadJson(backupFileName(), payload);
}

export class InvalidBackupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBackupError';
  }
}

export function parseBackup(raw: unknown): BackupPayload {
  const result = backupSchema.safeParse(raw);
  if (!result.success) {
    throw new InvalidBackupError(
      'El archivo no tiene un formato de copia de seguridad de YOU válido.'
    );
  }
  return result.data;
}

const ALL_TABLES = () => [
  db.settings,
  db.habits,
  db.habitLogs,
  db.waterEntries,
  db.weightEntries,
  db.exerciseEntries,
  db.streaks,
  db.recoveryMissions,
  db.penalties,
  db.coachMessages,
  db.dailySummaries,
];

async function clearAllTables(): Promise<void> {
  await Promise.all(ALL_TABLES().map((table) => table.clear()));
}

/** Replaces all local data with the given backup, inside one transaction. */
export async function importBackup(payload: BackupPayload): Promise<void> {
  const { data } = payload;
  await db.transaction('rw', ALL_TABLES(), async () => {
    await clearAllTables();
    await Promise.all([
      bulkAddUnknown(db.settings, data.settings),
      bulkAddUnknown(db.habits, data.habits),
      bulkAddUnknown(db.habitLogs, data.habitLogs),
      bulkAddUnknown(db.waterEntries, data.waterEntries),
      bulkAddUnknown(db.weightEntries, data.weightEntries),
      bulkAddUnknown(db.exerciseEntries, data.exerciseEntries),
      bulkAddUnknown(db.streaks, data.streaks),
      bulkAddUnknown(db.recoveryMissions, data.recoveryMissions),
      bulkAddUnknown(db.penalties, data.penalties),
      bulkAddUnknown(db.coachMessages, data.coachMessages),
      bulkAddUnknown(db.dailySummaries, data.dailySummaries),
    ]);
  });
}

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', ALL_TABLES(), async () => {
    await clearAllTables();
  });
}
