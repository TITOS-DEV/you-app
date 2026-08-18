import type { DateKey, Timestamp } from './common';

export interface WeightEntry {
  id: string;
  date: DateKey;
  /** optional HH:mm */
  time?: string;
  weightKg: number;
  createdAt: Timestamp;
}

export type WeightRange = '7d' | '30d' | '3m' | '6m' | 'all';

export type BmiCategory =
  | 'bajo peso'
  | 'peso saludable'
  | 'sobrepeso'
  | 'obesidad';
