import { CheckCircle2, Droplets, Dumbbell, Scale } from 'lucide-react';
import { useSheetStore } from '@/stores/sheetStore';

const ACTIONS = [
  { id: 'addWater', label: 'Agua', icon: Droplets, tint: 'text-accent-2 bg-accent-2/10' },
  { id: 'addWeight', label: 'Peso', icon: Scale, tint: 'text-accent bg-accent/10' },
  { id: 'addExercise', label: 'Ejercicio', icon: Dumbbell, tint: 'text-warning bg-warning/10' },
  { id: 'habitForm', label: 'Hábito', icon: CheckCircle2, tint: 'text-success bg-success/10' },
] as const;

export function QuickActionGrid() {
  const open = useSheetStore((s) => s.open);

  return (
    <div className="grid grid-cols-4 gap-3">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => open(action.id)}
            className="flex flex-col items-center gap-2 rounded-2xl py-2 transition-transform active:scale-95"
          >
            <span className={`flex h-14 w-14 items-center justify-center rounded-full ${action.tint}`}>
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-[13px] font-medium text-text-primary">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
