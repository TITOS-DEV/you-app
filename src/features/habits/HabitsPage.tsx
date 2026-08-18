import { useState } from 'react';
import { Plus, ListChecks } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { HabitCard } from '@/components/habits/HabitCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useActiveHabits, useHabitsToday, useSetHabitQuantity, useToggleHabit } from '@/hooks/useHabits';
import { useSheetStore } from '@/stores/sheetStore';
import { useToastStore } from '@/stores/toastStore';
import { HabitStreakRow } from '@/features/habits/HabitStreakRow';
import { GlobalStreakCard } from '@/features/habits/GlobalStreakCard';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types';

type FilterTab = 'activos' | 'completados';

export function HabitsPage() {
  const [filter, setFilter] = useState<FilterTab>('activos');
  const items = useHabitsToday();
  const activeHabits = useActiveHabits();
  const toggle = useToggleHabit();
  const setQuantity = useSetHabitQuantity();
  const openSheet = useSheetStore((s) => s.open);
  const showToast = useToastStore((s) => s.show);

  const due = items.filter((i) => i.due);
  const pending = due.filter((i) => !i.log?.completed);
  const done = due.filter((i) => i.log?.completed);
  const visible = filter === 'activos' ? pending : done;

  async function handleToggle(habit: Habit) {
    await toggle(habit.id);
  }

  async function handleIncrement(habit: Habit) {
    const current = items.find((i) => i.habit.id === habit.id)?.log?.quantityValue ?? 0;
    const target = habit.quantityTarget ?? 1;
    const next = Math.min(current + 1, target);
    await setQuantity(habit.id, next, target);
    if (next >= target && current < target) showToast(`${habit.name} completado`, 'success');
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <AppHeader title="Hábitos" subtitle={`${done.length}/${due.length || 0} completados hoy`} />

      <div className="flex flex-col gap-5 px-5">
        <Button size="lg" onClick={() => openSheet('habitForm')} className="w-full">
          <Plus className="h-4 w-4" /> Crear hábito
        </Button>

        <div className="flex gap-1.5 rounded-full bg-surface-2 p-1">
          {(['activos', 'completados'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                'flex-1 rounded-full py-2 text-[13px] font-medium capitalize transition-colors',
                filter === tab ? 'bg-surface-1 text-text-primary shadow-sm' : 'text-text-secondary'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeHabits.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="h-6 w-6" />}
            title="No tienes hábitos todavía."
            description="Crea tu primer hábito y empieza a construir tu racha."
            action={<Button size="sm" onClick={() => openSheet('habitForm')}>Crear hábito</Button>}
          />
        ) : visible.length === 0 ? (
          <p className="py-6 text-center text-[14px] text-text-secondary">
            {filter === 'activos' ? 'Ya completaste todo por hoy.' : 'Nada completado todavía.'}
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {visible.map(({ habit, log }) => (
              <HabitCard key={habit.id} habit={habit} log={log} onToggle={handleToggle} onIncrement={handleIncrement} />
            ))}
          </div>
        )}

        {activeHabits.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-[17px] font-semibold text-text-primary">Rachas</h2>
            <GlobalStreakCard />
            <div className="flex flex-col gap-2">
              {activeHabits.map((habit) => (
                <HabitStreakRow key={habit.id} habit={habit} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
