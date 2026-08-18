import type { DateKey, Timestamp } from './common';

export interface WaterEntry {
  id: string;
  date: DateKey;
  amountMl: number;
  createdAt: Timestamp;
}

export const WATER_PRESETS_ML = [200, 250, 350, 500] as const;
