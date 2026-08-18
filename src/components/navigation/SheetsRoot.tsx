import { Sheet } from '@/components/ui/sheet';
import { QuickActionGrid } from '@/components/navigation/QuickActionGrid';
import { AddWaterForm } from '@/components/water/AddWaterForm';
import { AddWeightForm } from '@/components/weight/AddWeightForm';
import { AddExerciseForm } from '@/components/exercise/AddExerciseForm';
import { HabitForm } from '@/components/habits/HabitForm';
import { DayDetailContent } from '@/features/progress/DayDetailContent';
import { useSheetStore } from '@/stores/sheetStore';
import { formatFriendlyDate } from '@/utils/date';
import type { DateKey } from '@/types';

/** Single mount point for every bottom sheet in the app, switched by the
 * global sheet store. Keeps each feature's sheet content colocated with
 * its feature while avoiding a Sheet-per-page mounting cost. */
export function SheetsRoot() {
  const sheet = useSheetStore((s) => s.sheet);
  const close = useSheetStore((s) => s.close);
  const payload = useSheetStore((s) => s.payload) as { date?: DateKey } | undefined;
  const dayDetailDate = payload?.date;

  return (
    <>
      <Sheet open={sheet === 'quickAction'} onOpenChange={(o) => !o && close()} title="Acción rápida" description="Registra algo en segundos.">
        <QuickActionGrid />
      </Sheet>

      <Sheet open={sheet === 'addWater'} onOpenChange={(o) => !o && close()} title="Agua">
        <AddWaterForm onDone={close} />
      </Sheet>

      <Sheet open={sheet === 'addWeight'} onOpenChange={(o) => !o && close()} title="Peso">
        <AddWeightForm onDone={close} />
      </Sheet>

      <Sheet open={sheet === 'addExercise'} onOpenChange={(o) => !o && close()} title="Ejercicio">
        <AddExerciseForm onDone={close} />
      </Sheet>

      <Sheet open={sheet === 'habitForm'} onOpenChange={(o) => !o && close()} title="Nuevo hábito">
        <HabitForm onDone={close} />
      </Sheet>

      <Sheet
        open={sheet === 'dayDetail' && Boolean(dayDetailDate)}
        onOpenChange={(o) => !o && close()}
        title={dayDetailDate ? formatFriendlyDate(dayDetailDate) : ''}
      >
        {dayDetailDate && <DayDetailContent date={dayDetailDate} />}
      </Sheet>
    </>
  );
}
