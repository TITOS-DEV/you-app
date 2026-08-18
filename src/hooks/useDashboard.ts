import { useHabitsToday } from '@/hooks/useHabits';
import { useWaterToday } from '@/hooks/useWater';
import { useExerciseToday } from '@/hooks/useExercise';
import { useGlobalStreak } from '@/hooks/useStreak';

export function useTodaySummary() {
  const habits = useHabitsToday();
  const water = useWaterToday();
  const exercise = useExerciseToday();
  const streak = useGlobalStreak();

  const due = habits.filter((h) => h.due && h.habit.frequencyType !== 'weekly');
  const completed = due.filter((h) => h.log?.completed).length;
  const pct = due.length > 0 ? Math.round((completed / due.length) * 100) : 0;

  return {
    habitsCompleted: completed,
    habitsTotal: due.length,
    habitsPct: pct,
    waterGlasses: water.glasses,
    waterGoalGlasses: water.goalGlasses,
    exerciseMin: exercise.minutes,
    streak: streak.current,
  };
}
