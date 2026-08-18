import { ListChecks } from 'lucide-react';
import { HabitCard } from '@/components/habits/HabitCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useHabitsToday, useSetHabitQuantity, useToggleHabit } from '@/hooks/useHabits';
import { useSheetStore } from '@/stores/sheetStore';
import { useToastStore } from '@/stores/toastStore';
import type { Habit } from '@/types';

interface HabitListProps {
  limit?: number;
}

export function HabitList({ limit }: HabitListProps) {
  const items = useHabitsToday();
  const toggle = useToggleHabit();
  const setQuantity = useSetHabitQuantity();
  const openSheet = useSheetStore((s) => s.open);
  const showToast = useToastStore((s) => s.show);

  const dueItems = items.filter((i) => i.due);
  const visible = limit ? dueItems.slice(0, limit) : dueItems;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ListChecks className="h-6 w-6" />}
        title="No tienes hábitos todavía."
        description="Crea tu primer hábito y empieza a construir tu racha."
        action={
          <Button size="sm" onClick={() => openSheet('habitForm')}>
            Crear hábito
          </Button>
        }
      />
    );
  }

  async function handleToggle(habit: Habit) {
    const wasCompleted = items.find((i) => i.habit.id === habit.id)?.log?.completed;
    await toggle(habit.id);
    if (!wasCompleted) showToast(`${habit.name} completado`, 'success');
  }

  async function handleIncrement(habit: Habit) {
    const current = items.find((i) => i.habit.id === habit.id)?.log?.quantityValue ?? 0;
    const target = habit.quantityTarget ?? 1;
    const next = Math.min(current + 1, target);
    await setQuantity(habit.id, next, target);
    if (next >= target && current < target) showToast(`${habit.name} completado`, 'success');
  }

  return (
    <div className="flex flex-col gap-2.5">
      {visible.map(({ habit, log }) => (
        <HabitCard key={habit.id} habit={habit} log={log} onToggle={handleToggle} onIncrement={handleIncrement} />
      ))}
    </div>
  );
}
