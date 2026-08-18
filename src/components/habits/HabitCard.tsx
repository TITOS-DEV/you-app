import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { resolveHabitIcon } from '@/lib/habitIcons';
import { useHaptics } from '@/hooks/useHaptics';
import { cn } from '@/lib/utils';
import type { Habit, HabitLog } from '@/types';

interface HabitCardProps {
  habit: Habit;
  log?: HabitLog;
  onToggle: (habit: Habit) => void;
  onIncrement?: (habit: Habit) => void;
}

export function HabitCard({ habit, log, onToggle, onIncrement }: HabitCardProps) {
  const Icon = resolveHabitIcon(habit.icon);
  const vibrate = useHaptics();
  const isQuantity = habit.frequencyType === 'quantity' && Boolean(habit.quantityTarget);
  const completed = Boolean(log?.completed);
  const progressValue = log?.quantityValue ?? 0;

  function handlePrimaryTap() {
    if (isQuantity) return;
    vibrate(completed ? 'light' : 'success');
    onToggle(habit);
  }

  function handleIncrement() {
    vibrate(completed ? 'success' : 'light');
    onIncrement?.(habit);
  }

  return (
    <motion.div
      layout
      className={cn(
        'flex w-full items-center gap-3.5 rounded-3xl border px-4 py-3.5 text-left transition-colors',
        completed ? 'border-transparent bg-surface-2' : 'border-border-subtle bg-surface-1'
      )}
    >
      <button
        type="button"
        onClick={handlePrimaryTap}
        className="flex min-w-0 flex-1 items-center gap-3.5 text-left"
        disabled={isQuantity}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: `${habit.color}1f`, color: habit.color }}
        >
          <Icon size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate text-[15px] font-medium',
              completed ? 'text-text-secondary line-through decoration-2' : 'text-text-primary'
            )}
          >
            {habit.name}
          </p>
          {isQuantity && (
            <p className="text-[13px] text-text-secondary">
              {progressValue}/{habit.quantityTarget} {habit.unit}
            </p>
          )}
        </div>
      </button>

      {isQuantity ? (
        <button
          type="button"
          onClick={handleIncrement}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors active:scale-95',
            completed ? 'border-success bg-success text-white' : 'border-accent/40 text-accent'
          )}
          aria-label={`Sumar a ${habit.name}`}
        >
          {completed ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5} />}
        </button>
      ) : (
        <motion.button
          type="button"
          onClick={handlePrimaryTap}
          animate={completed ? { scale: [0.7, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
            completed ? 'border-success bg-success text-white' : 'border-border-strong text-transparent'
          )}
          aria-label={completed ? `Marcar ${habit.name} como pendiente` : `Completar ${habit.name}`}
        >
          <Check size={16} strokeWidth={3} />
        </motion.button>
      )}
    </motion.div>
  );
}
