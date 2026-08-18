import { db } from '@/lib/db';
import { createId } from '@/lib/utils';
import type { Penalty } from '@/types';

/**
 * Healthy, safe "penitencias" — small positive actions offered after a
 * missed streak, never anything involving pain, self-harm, starvation,
 * dehydration or extreme exercise.
 */
const RECOVERY_TEMPLATES: { title: string; description: string }[] = [
  { title: 'Camina 15 minutos', description: 'Camina 15 minutos adicionales hoy.' },
  { title: 'Lee 20 minutos', description: 'Lee durante 20 minutos antes de dormir.' },
  {
    title: 'Hidrátate dos días seguidos',
    description: 'Cumple tu objetivo de hidratación durante los próximos 2 días.',
  },
  { title: 'Respira y planea', description: 'Dedica 5 minutos a planear tu día de mañana.' },
];

function pickTemplate(seed: number) {
  return RECOVERY_TEMPLATES[seed % RECOVERY_TEMPLATES.length];
}

export async function createPenaltyForStreakLoss(streakSourceId: string, streakLost: number): Promise<Penalty> {
  const template = pickTemplate(streakLost + Date.now());
  const penalty: Penalty = {
    id: createId(),
    reason: 'habit',
    title: template.title,
    description: template.description,
    status: 'pending',
    streakLost,
    createdAt: new Date().toISOString(),
  };
  await db.penalties.add(penalty);
  void streakSourceId;
  return penalty;
}

export async function listPenalties(): Promise<Penalty[]> {
  const all = await db.penalties.toArray();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPendingPenalty(): Promise<Penalty | undefined> {
  const all = await listPenalties();
  return all.find((p) => p.status === 'pending' || p.status === 'active');
}

export async function acceptPenalty(id: string): Promise<void> {
  await db.penalties.update(id, { status: 'active' });
}

export async function completePenalty(id: string): Promise<void> {
  await db.penalties.update(id, { status: 'completed', completedAt: new Date().toISOString() });
}

export async function skipPenalty(id: string): Promise<void> {
  await db.penalties.update(id, { status: 'skipped' });
}
