import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { DEFAULT_SETTINGS } from '@/types';
import type { UserSettings } from '@/types';

/** Live view of the single settings row. Falls back to defaults until the
 * row exists so the UI never has to null-check settings everywhere. */
export function useSettings(): UserSettings {
  const settings = useLiveQuery(() => db.settings.get('settings'), []);
  return settings ?? DEFAULT_SETTINGS;
}
