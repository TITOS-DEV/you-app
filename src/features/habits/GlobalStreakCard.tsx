import { StreakBadge } from '@/components/streak/StreakBadge';
import { useGlobalStreak } from '@/hooks/useStreak';

export function GlobalStreakCard() {
  const streak = useGlobalStreak();

  return (
    <div className="flex items-center justify-between rounded-3xl border border-border-subtle bg-surface-1 px-5 py-4">
      <div>
        <p className="text-[12px] text-text-secondary">Racha actual</p>
        <div className="mt-1">
          <StreakBadge days={streak.current} size="lg" />
        </div>
      </div>
      <div className="text-right">
        <p className="text-[12px] text-text-secondary">Mejor racha</p>
        <p className="mt-1 text-[15px] font-semibold text-text-primary">🔥 {streak.longest} días</p>
      </div>
    </div>
  );
}
