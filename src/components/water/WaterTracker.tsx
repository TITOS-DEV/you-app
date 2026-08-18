import { Droplets, Plus } from 'lucide-react';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { Button } from '@/components/ui/button';
import { useWaterToday } from '@/hooks/useWater';
import { useSheetStore } from '@/stores/sheetStore';

export function WaterTracker() {
  const { glasses, goalGlasses, pct, totalMl } = useWaterToday();
  const openSheet = useSheetStore((s) => s.open);

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <ProgressRing value={pct} size={168} strokeWidth={14} color="var(--accent-2)">
        <div className="flex flex-col items-center">
          <Droplets className="mb-1 h-5 w-5 text-accent-2" />
          <span className="text-3xl font-bold tracking-tight text-text-primary">
            {glasses}
            <span className="text-lg font-medium text-text-secondary"> / {goalGlasses}</span>
          </span>
          <span className="text-[13px] text-text-secondary">vasos · {totalMl} ml</span>
        </div>
      </ProgressRing>
      <Button size="lg" onClick={() => openSheet('addWater')} className="w-full">
        <Plus className="h-4 w-4" /> Agua
      </Button>
    </div>
  );
}
