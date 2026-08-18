import { Scale, Droplets, Dumbbell, ListChecks } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { StatCard } from '@/components/ui/stat-card';
import { WeightChart } from '@/components/charts/WeightChart';
import { WaterChart } from '@/components/charts/WaterChart';
import { WaterTracker } from '@/components/water/WaterTracker';
import { ActivityCalendar } from '@/components/charts/ActivityCalendar';
import { useLatestWeight, useWeightChange } from '@/hooks/useWeight';
import { useBmi, useWaterAverage, useWeeklySummary } from '@/hooks/useAnalytics';
import { useExerciseWeek } from '@/hooks/useExercise';
import { formatMinutes } from '@/services/exerciseService';
import { bmiCategory } from '@/services/weightService';
import { useSheetStore } from '@/stores/sheetStore';

export function ProgressPage() {
  const latestWeight = useLatestWeight();
  const weightChange = useWeightChange();
  const bmi = useBmi();
  const waterAvg = useWaterAverage(7);
  const exerciseWeek = useExerciseWeek();
  const weekly = useWeeklySummary();
  const openSheet = useSheetStore((s) => s.open);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <AppHeader title="Progreso" subtitle="Tu evolución, en un vistazo." />

      <div className="flex flex-col gap-5 px-5">
        {weekly && (
          <div className="rounded-3xl border border-border-subtle bg-surface-1 p-5">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-secondary">Esta semana</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-text-primary">
              <SummaryRow label="Hábitos" value={`${weekly.habitsPct}%`} />
              <SummaryRow label="Agua" value={`${weekly.waterPct}%`} />
              <SummaryRow label="Ejercicio" value={formatMinutes(weekly.exerciseMin)} />
              <SummaryRow label="Racha" value={`🔥 ${weekly.streak} días`} />
            </div>
            <p className="mt-4 text-[14px] text-text-secondary">{weekly.conclusion}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Scale size={15} />}
            label="Peso"
            value={latestWeight ? `${latestWeight.weightKg} kg` : '—'}
            sub={weightChange !== undefined ? `${weightChange > 0 ? '+' : ''}${weightChange} kg` : 'Sin datos'}
            onClick={() => openSheet('addWeight')}
          />
          <StatCard
            icon={<ListChecks size={15} />}
            label="IMC"
            value={bmi ?? '—'}
            sub={bmi ? bmiCategory(bmi) : 'Añade tu altura en Ajustes'}
          />
          <StatCard icon={<Droplets size={15} />} label="Agua promedio" value={`${waterAvg ?? 0} ml`} sub="últimos 7 días" />
          <StatCard
            icon={<Dumbbell size={15} />}
            label="Ejercicio"
            value={formatMinutes(exerciseWeek.minutes)}
            sub="esta semana"
            onClick={() => openSheet('addExercise')}
          />
        </div>

        <section className="rounded-3xl border border-border-subtle bg-surface-1 p-5">
          <h2 className="mb-3 text-[15px] font-semibold text-text-primary">Peso</h2>
          <WeightChart />
        </section>

        <section className="rounded-3xl border border-border-subtle bg-surface-1 p-5">
          <h2 className="mb-3 text-[15px] font-semibold text-text-primary">Hidratación</h2>
          <WaterTracker />
          <div className="mt-2 border-t border-border-subtle pt-4">
            <WaterChart days={7} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-text-primary">Calendario</h2>
          <ActivityCalendar />
        </section>

        <p className="px-1 text-center text-[12px] text-text-tertiary">
          El IMC es una referencia general y no reemplaza una valoración médica.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-text-secondary">{label}</p>
      <p className="text-[16px] font-semibold">{value}</p>
    </div>
  );
}
