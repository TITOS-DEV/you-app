import type { DateKey, Intensity, Timestamp } from './common';

export type ExerciseType =
  | 'caminar'
  | 'correr'
  | 'gimnasio'
  | 'boxeo'
  | 'futbol'
  | 'bicicleta'
  | 'natacion'
  | 'otro';

export interface ExerciseEntry {
  id: string;
  date: DateKey;
  type: ExerciseType;
  durationMin: number;
  intensity?: Intensity;
  note?: string;
  createdAt: Timestamp;
}

export const EXERCISE_TYPE_LABEL: Record<ExerciseType, string> = {
  caminar: 'Caminar',
  correr: 'Correr',
  gimnasio: 'Gimnasio',
  boxeo: 'Boxeo',
  futbol: 'Fútbol',
  bicicleta: 'Bicicleta',
  natacion: 'Natación',
  otro: 'Otro',
};
