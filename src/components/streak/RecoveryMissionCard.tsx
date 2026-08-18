import { Target } from 'lucide-react';
import { useActiveRecoveryMission } from '@/hooks/useStreak';

export function RecoveryMissionCard() {
  const mission = useActiveRecoveryMission();
  if (!mission) return null;

  const pct = Math.round((mission.progressDays / mission.targetConsecutiveDays) * 100);

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-1 p-5">
      <div className="flex items-center gap-2 text-accent">
        <Target size={17} />
        <span className="text-[13px] font-semibold uppercase tracking-wide">Misión de recuperación</span>
      </div>
      <div className="mt-3 flex items-baseline gap-4 text-text-primary">
        <div>
          <p className="text-[12px] text-text-secondary">Racha anterior</p>
          <p className="text-xl font-semibold">{mission.previousStreak} días</p>
        </div>
        <div>
          <p className="text-[12px] text-text-secondary">Objetivo</p>
          <p className="text-xl font-semibold">{mission.targetConsecutiveDays} días seguidos</p>
        </div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[13px] text-text-secondary">
        {mission.progressDays}/{mission.targetConsecutiveDays} días consecutivos completados
      </p>
    </div>
  );
}
