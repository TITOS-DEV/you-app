import type { ThemeMode, Timestamp, UnitSystem } from './common';

/**
 * Singleton settings record for the single person using YOU. There is no
 * concept of an account — this simply holds their preferences.
 */
export interface UserSettings {
  id: 'settings';
  name: string;
  age?: number;
  heightCm?: number;
  weightGoalKg?: number;
  waterGoalMl: number;
  glassSizeMl: number;
  theme: ThemeMode;
  units: UnitSystem;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'settings',
  name: '',
  waterGoalMl: 2000,
  glassSizeMl: 250,
  theme: 'system',
  units: 'metric',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
