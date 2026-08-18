import { Bike, Dumbbell, Footprints, HelpCircle, Shirt, Trophy, Waves, Zap } from 'lucide-react';
import { EXERCISE_TYPE_LABEL, type ExerciseEntry, type ExerciseType } from '@/types';
import { formatMinutes } from '@/services/exerciseService';

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

const INTENSITY_LABEL: Record<string, string> = { low: 'Baja', medium: 'Media', high: 'Alta' };

export function ExerciseCard({ entry }: { entry: ExerciseEntry }) {
  const Icon = TYPE_ICONS[entry.type];
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-text-primary">{EXERCISE_TYPE_LABEL[entry.type]}</p>
        <p className="text-[13px] text-text-secondary">
          {formatMinutes(entry.durationMin)}
          {entry.intensity ? ` · Intensidad ${INTENSITY_LABEL[entry.intensity]}` : ''}
        </p>
      </div>
    </div>
  );
}
