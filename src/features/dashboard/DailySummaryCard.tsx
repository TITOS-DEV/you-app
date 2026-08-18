import type { ReactNode } from 'react';
import { Droplets, Flame, ListChecks, Timer } from 'lucide-react';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { useTodaySummary } from '@/hooks/useDashboard';
import { dayProgressPhrase } from '@/lib/messages';

export function DailySummaryCard() {
  const summary = useTodaySummary();

  return (
    <div className="rounded-3xl bg-surface-1 border border-border-subtle p-5">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-text-secondary">Tu día</p>

      <div className="mt-3 flex items-center gap-5">
        <ProgressRing value={summary.habitsPct} size={92} strokeWidth={9}>
          <span className="text-xl font-bold text-text-primary">{summary.habitsPct}%</span>
        </ProgressRing>
        <p className="flex-1 text-[15px] font-medium text-text-primary">
          {dayProgressPhrase(summary.habitsPct)}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        <MiniStat icon={<ListChecks size={15} />} value={`${summary.habitsCompleted}/${summary.habitsTotal || 0}`} label="hábitos" />
        <MiniStat icon={<Droplets size={15} />} value={`${summary.waterGlasses}/${summary.waterGoalGlasses}`} label="vasos" />
        <MiniStat icon={<Timer size={15} />} value={`${summary.exerciseMin}`} label="min" />
        <MiniStat icon={<Flame size={15} />} value={`${summary.streak}`} label="días" tone="text-warning" />
      </div>
    </div>
  );
}

function MiniStat({ icon, value, label, tone }: { icon: ReactNode; value: string; label: string; tone?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface-2 py-3">
      <span className={tone ?? 'text-text-secondary'}>{icon}</span>
      <span className="text-[14px] font-semibold text-text-primary">{value}</span>
      <span className="text-[10.5px] text-text-tertiary">{label}</span>
    </div>
  );
}
