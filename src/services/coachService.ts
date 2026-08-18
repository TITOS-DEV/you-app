import { db } from '@/lib/db';
import { createId } from '@/lib/utils';
import {
  getBestDay,
  getCurrentStreak,
  getExerciseMinutesWeek,
  getWaterAverage,
  getWeekdayCompletionRates,
  getWeeklyCompletion,
  getWorstDay,
} from '@/services/analyticsService';
import { getWeightChange } from '@/services/weightService';
import { getActiveRecoveryMission, getGlobalStreak } from '@/services/streakService';
import type { CoachMessage, CoachMessageType } from '@/types';

const WEEKDAY_NAMES = [
  'domingos',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábados',
];

function makeMessage(
  type: CoachMessageType,
  text: string,
  extra?: Partial<CoachMessage>
): CoachMessage {
  return {
    id: createId(),
    type,
    text,
    answered: false,
    createdAt: new Date().toISOString(),
    ...extra,
  };
}

/** Builds a fresh batch of insight/question cards from current data. Pure
 * generation — persistence is a separate step so callers can dedupe. */
export async function generateCoachInsights(): Promise<CoachMessage[]> {
  const [
    weeklyPct,
    waterAvg,
    exerciseMin,
    streak,
    weightChange,
    weekdayRates,
    worst,
  ] = await Promise.all([
    getWeeklyCompletion(),
    getWaterAverage(7),
    getExerciseMinutesWeek(),
    getCurrentStreak(),
    getWeightChange(),
    getWeekdayCompletionRates(4),
    getWorstDay(14),
  ]);

  const messages: CoachMessage[] = [];

  if (exerciseMin > 0) {
    const sessions = Math.max(1, Math.round(exerciseMin / 30));
    messages.push(
      makeMessage('insight', `Esta semana entrenaste alrededor de ${sessions} veces. Sigue así.`, {
        metric: 'exercise',
      })
    );
  }

  if (weightChange !== undefined) {
    const direction = weightChange < 0 ? 'bajaste' : weightChange > 0 ? 'subiste' : 'mantuviste';
    messages.push(
      makeMessage('insight', `Tu peso ${direction} ${Math.abs(weightChange)} kg desde el último registro.`, {
        metric: 'weight',
      })
    );
  }

  if (waterAvg > 0) {
    messages.push(
      makeMessage('insight', `Tu hidratación promedio esta semana fue de ${waterAvg} ml al día.`, {
        metric: 'water',
      })
    );
  }

  if (streak > 0) {
    messages.push(makeMessage('insight', `Llevas ${streak} días de racha. No la sueltes.`, { metric: 'streak' }));
  }

  const validRates = weekdayRates
    .map((pct, idx) => ({ pct, idx }))
    .filter((r) => r.pct >= 0);
  if (validRates.length >= 3) {
    const min = validRates.reduce((a, b) => (b.pct < a.pct ? b : a));
    const max = validRates.reduce((a, b) => (b.pct > a.pct ? b : a));
    if (max.pct - min.pct >= 20) {
      messages.push(
        makeMessage(
          'question',
          `Los ${WEEKDAY_NAMES[min.idx]} estás completando menos hábitos que el resto de la semana.`,
          { metric: 'consistency', question: `¿Quieres mejorar tus ${WEEKDAY_NAMES[min.idx]}?` }
        )
      );
    }
  }

  if (worst && worst.pct < 50) {
    messages.push(
      makeMessage('question', 'Hubo un día reciente bastante flojo en tus hábitos.', {
        metric: 'habits',
        question: '¿Qué te impidió avanzar ese día?',
      })
    );
  }

  if (weeklyPct < 60) {
    messages.push(
      makeMessage('recommendation', 'Tu consistencia bajó esta semana comparado con lo habitual.', {
        metric: 'habits',
      })
    );
  }

  const globalStreak = await getGlobalStreak();
  const mission = await getActiveRecoveryMission(globalStreak.id);
  if (mission && !mission.completedAt) {
    messages.push(
      makeMessage(
        'recovery',
        `Misión de recuperación en curso: ${mission.progressDays}/${mission.targetConsecutiveDays} días consecutivos.`,
        { metric: 'streak' }
      )
    );
  }

  return messages;
}

const SMART_QUESTIONS: { question: string; metric: CoachMessage['metric'] }[] = [
  { question: '¿Dormiste bien anoche?', metric: 'consistency' },
  { question: '¿Qué hábito te está costando más esta semana?', metric: 'habits' },
  { question: '¿Por qué tomaste menos agua ayer?', metric: 'water' },
  { question: '¿Quieres cambiar alguno de tus objetivos?', metric: 'habits' },
];

/** Picks one contextual question tied to real signals when possible,
 * otherwise falls back to a rotating smart-question pool — never random
 * for randomness' sake. */
export async function pickSmartQuestion(): Promise<CoachMessage> {
  const best = await getBestDay(7);
  if (!best || best.pct < 40) {
    return makeMessage('question', 'Ayer no fue tu mejor día.', {
      metric: 'habits',
      question: '¿Qué te impidió avanzar ayer?',
    });
  }
  const pick = SMART_QUESTIONS[Math.floor(Math.random() * SMART_QUESTIONS.length)];
  return makeMessage('question', 'Un momento para reflexionar.', {
    metric: pick.metric,
    question: pick.question,
  });
}

export async function saveCoachMessages(messages: CoachMessage[]): Promise<void> {
  await db.coachMessages.bulkAdd(messages);
}

export async function listCoachMessages(): Promise<CoachMessage[]> {
  const all = await db.coachMessages.toArray();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function answerCoachMessage(id: string, answer: 'yes' | 'later'): Promise<void> {
  await db.coachMessages.update(id, { answered: true, answer });
}

let ensureFeedInFlight: Promise<void> | null = null;

/** Refreshes today's coach feed if it hasn't been generated yet today.
 * Callers (e.g. React StrictMode's double-invoked effects, or the hook
 * mounting twice) can race the read-then-write below, which would insert
 * duplicate messages; sharing one in-flight promise collapses concurrent
 * calls into a single generation. */
export async function ensureTodayCoachFeed(): Promise<void> {
  if (ensureFeedInFlight) return ensureFeedInFlight;
  ensureFeedInFlight = (async () => {
    try {
      const todayPrefix = new Date().toISOString().slice(0, 10);
      const existing = await db.coachMessages.toArray();
      const generatedToday = existing.some((m) => m.createdAt.startsWith(todayPrefix));
      if (generatedToday) return;
      const insights = await generateCoachInsights();
      if (insights.length > 0) await saveCoachMessages(insights);
    } finally {
      ensureFeedInFlight = null;
    }
  })();
  return ensureFeedInFlight;
}
