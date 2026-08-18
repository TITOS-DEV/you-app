import type { DateKey, Timestamp } from './common';

export type HabitFrequencyType = 'daily' | 'specificDays' | 'weekly' | 'quantity';

export type HabitDifficulty = 'easy' | 'medium' | 'hard';

export interface Habit {
  id: string;
  name: string;
  /** lucide-react icon name, e.g. "Droplets" */
  icon: string;
  frequencyType: HabitFrequencyType;
  /** used when frequencyType === 'specificDays'; 0 = Sunday .. 6 = Saturday */
  specificDays?: number[];
  /** used when frequencyType === 'weekly'; times per week */
  weeklyTarget?: number;
  /** used when frequencyType === 'quantity'; daily numeric goal */
  quantityTarget?: number;
  /** unit label for quantity habits, e.g. "páginas", "min" */
  unit?: string;
  difficulty: HabitDifficulty;
  color: string;
  sortOrder: number;
  createdAt: Timestamp;
  archivedAt?: Timestamp;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: DateKey;
  completed: boolean;
  /** progress value for quantity habits */
  quantityValue?: number;
  completedAt: Timestamp;
}

export type NewHabit = Omit<Habit, 'id' | 'createdAt' | 'sortOrder'>;
