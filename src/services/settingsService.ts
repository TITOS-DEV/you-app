import { db } from '@/lib/db';
import { DEFAULT_SETTINGS } from '@/types';
import type { UserSettings } from '@/types';

export async function getSettings(): Promise<UserSettings> {
  const existing = await db.settings.get('settings');
  if (existing) return existing;
  await db.settings.add(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export async function updateSettings(changes: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getSettings();
  const updated: UserSettings = { ...current, ...changes, updatedAt: new Date().toISOString() };
  await db.settings.put(updated);
  return updated;
}
