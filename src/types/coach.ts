import type { Timestamp } from './common';

export type CoachMessageType = 'insight' | 'question' | 'recommendation' | 'recovery';

export type CoachMetric =
  | 'habits'
  | 'water'
  | 'weight'
  | 'exercise'
  | 'streak'
  | 'consistency';

export interface CoachMessage {
  id: string;
  type: CoachMessageType;
  text: string;
  metric?: CoachMetric;
  /** present when the message is a yes/no question */
  question?: string;
  answered: boolean;
  answer?: 'yes' | 'later';
  createdAt: Timestamp;
}
