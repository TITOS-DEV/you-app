import { useState } from 'react';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HABIT_COLORS, HABIT_ICON_NAMES, resolveHabitIcon } from '@/lib/habitIcons';
import { cn } from '@/lib/utils';
import * as habitService from '@/services/habitService';
import { useToastStore } from '@/stores/toastStore';
import type { Habit, HabitDifficulty, HabitFrequencyType } from '@/types';

const FREQUENCY_OPTIONS: { value: HabitFrequencyType; label: string }[] = [
  { value: 'daily', label: 'Diario' },
  { value: 'specificDays', label: 'Días específicos' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'quantity', label: 'Cantidad diaria' },
];

const WEEKDAYS = [
  { value: 1, label: 'L' },
  { value: 2, label: 'M' },
  { value: 3, label: 'X' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
  { value: 6, label: 'S' },
  { value: 0, label: 'D' },
];

const DIFFICULTIES: { value: HabitDifficulty; label: string }[] = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Media' },
  { value: 'hard', label: 'Difícil' },
];

interface HabitFormProps {
  onDone: () => void;
}

export function HabitForm({ onDone }: HabitFormProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(HABIT_ICON_NAMES[0]);
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [frequencyType, setFrequencyType] = useState<HabitFrequencyType>('daily');
  const [specificDays, setSpecificDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [weeklyTarget, setWeeklyTarget] = useState(3);
  const [quantityTarget, setQuantityTarget] = useState(8);
  const [unit, setUnit] = useState('vasos');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('medium');
  const [saving, setSaving] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const canSave = name.trim().length > 0;

  async function handleSubmit() {
    if (!canSave || saving) return;
    setSaving(true);
    const input: Omit<Habit, 'id' | 'createdAt' | 'sortOrder'> = {
      name: name.trim(),
      icon,
      color,
      frequencyType,
      difficulty,
      specificDays: frequencyType === 'specificDays' ? specificDays : undefined,
      weeklyTarget: frequencyType === 'weekly' ? weeklyTarget : undefined,
      quantityTarget: frequencyType === 'quantity' ? quantityTarget : undefined,
      unit: frequencyType === 'quantity' ? unit : undefined,
    };
    await habitService.createHabit(input);
    setSaving(false);
    showToast('Hábito creado', 'success');
    onDone();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="habit-name">Nombre</Label>
        <Input id="habit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Leer" autoFocus />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Icono</Label>
        <div className="grid grid-cols-6 gap-2">
          {HABIT_ICON_NAMES.map((n) => {
            const Icon = resolveHabitIcon(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setIcon(n)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-colors',
                  icon === n ? 'border-accent text-accent bg-accent/10' : 'border-transparent bg-surface-2 text-text-secondary'
                )}
                aria-label={n}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn('h-8 w-8 rounded-full border-2', color === c ? 'border-text-primary' : 'border-transparent')}
              style={{ background: c }}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Frecuencia</Label>
        <div className="grid grid-cols-2 gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFrequencyType(opt.value)}
              className={cn(
                'rounded-2xl border px-3 py-2.5 text-[13px] font-medium transition-colors',
                frequencyType === opt.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border-subtle text-text-secondary'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {frequencyType === 'specificDays' && (
        <div className="flex flex-col gap-2">
          <Label>Días</Label>
          <div className="flex gap-1.5">
            {WEEKDAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() =>
                  setSpecificDays((prev) =>
                    prev.includes(d.value) ? prev.filter((x) => x !== d.value) : [...prev, d.value]
                  )
                }
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors',
                  specificDays.includes(d.value) ? 'bg-accent text-accent-contrast' : 'bg-surface-2 text-text-secondary'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {frequencyType === 'weekly' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="weekly-target">Veces por semana</Label>
          <Input
            id="weekly-target"
            type="number"
            min={1}
            max={7}
            value={weeklyTarget}
            onChange={(e) => setWeeklyTarget(Number(e.target.value))}
          />
        </div>
      )}

      {frequencyType === 'quantity' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="qty-target">Objetivo diario</Label>
            <Input
              id="qty-target"
              type="number"
              min={1}
              value={quantityTarget}
              onChange={(e) => setQuantityTarget(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="qty-unit">Unidad</Label>
            <Input id="qty-unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="páginas" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label>Dificultad</Label>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={cn(
                'rounded-2xl border px-3 py-2.5 text-[13px] font-medium transition-colors',
                difficulty === d.value ? 'border-accent bg-accent/10 text-accent' : 'border-border-subtle text-text-secondary'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" disabled={!canSave || saving} onClick={handleSubmit} className="mt-1">
        Crear hábito
      </Button>
    </div>
  );
}
