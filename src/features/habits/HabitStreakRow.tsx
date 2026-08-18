import { resolveHabitIcon } from '@/lib/habitIcons';
import { useHabitStreak } from '@/hooks/useStreak';
import { StreakBadge } from '@/components/streak/StreakBadge';
import type { Habit } from '@/types';

export function HabitStreakRow({ habit }: { habit: Habit }) {
  const streak = useHabitStreak(habit.id);
  const Icon = resolveHabitIcon(habit.icon);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${habit.color}1f`, color: habit.color }}
      >
        <Icon size={16} />
      </div>
      <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-text-primary">{habit.name}</p>
      <StreakBadge days={streak.current} size="sm" />
    </div>
  );
}
