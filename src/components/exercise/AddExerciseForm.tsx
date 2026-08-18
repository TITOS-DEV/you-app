import { useState } from 'react';
import { Bike, Dumbbell, Footprints, Shirt, Trophy, Waves, Zap, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as exerciseService from '@/services/exerciseService';
import { EXERCISE_TYPE_LABEL } from '@/types';
import type { ExerciseType, Intensity } from '@/types';
import { useToastStore } from '@/stores/toastStore';

const TYPE_ICONS: Record<ExerciseType, typeof Dumbbell> = {
  caminar: Footprints,
  correr: Zap,
  gimnasio: Dumbbell,
  boxeo: Shirt,
  futbol: Trophy,
  bicicleta: Bike,
  natacion: Waves,
  otro: HelpCircle,
};

const INTENSITIES: { value: Intensity; label: string }[] = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
];

interface AddExerciseFormProps {
  onDone: () => void;
}

export function AddExerciseForm({ onDone }: AddExerciseFormProps) {
  const [type, setType] = useState<ExerciseType>('caminar');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState<Intensity | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const durationNum = Number(duration);
  const canSave = durationNum > 0 && !saving;

  async function handleSubmit() {
    if (!canSave) return;
    setSaving(true);
    await exerciseService.logExercise({ type, durationMin: durationNum, intensity });
    setSaving(false);
    showToast('Ejercicio registrado', 'success');
    onDone();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Tipo</Label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(EXERCISE_TYPE_LABEL) as ExerciseType[]).map((t) => {
            const Icon = TYPE_ICONS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 text-[11px] font-medium transition-colors',
                  type === t ? 'border-accent bg-accent/10 text-accent' : 'border-border-subtle text-text-secondary'
                )}
              >
                <Icon size={17} />
                {EXERCISE_TYPE_LABEL[t]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="duration">Duración (min)</Label>
        <Input id="duration" type="number" inputMode="numeric" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Intensidad (opcional)</Label>
        <div className="grid grid-cols-3 gap-2">
          {INTENSITIES.map((i) => (
            <button
              key={i.value}
              type="button"
              onClick={() => setIntensity((prev) => (prev === i.value ? undefined : i.value))}
              className={cn(
                'rounded-2xl border px-3 py-2.5 text-[13px] font-medium transition-colors',
                intensity === i.value ? 'border-accent bg-accent/10 text-accent' : 'border-border-subtle text-text-secondary'
              )}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" disabled={!canSave} onClick={handleSubmit} className="mt-1">
        Registrar ejercicio
      </Button>
    </div>
  );
}
