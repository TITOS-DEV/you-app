import { motion } from 'framer-motion';
import { usePendingPenalty } from '@/hooks/useStreak';
import { useGlobalStreak } from '@/hooks/useStreak';
import { PenaltyCard } from '@/components/streak/PenaltyCard';
import { RecoveryMissionCard } from '@/components/streak/RecoveryMissionCard';

/** Shown when the streak just broke. Calm, non-punitive framing: what was
 * lost, where things stand now, and a concrete way back. */
export function StreakLostBanner() {
  const penalty = usePendingPenalty();
  const streak = useGlobalStreak();

  if (!penalty || penalty.reason !== 'habit') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      <div className="rounded-3xl bg-surface-2 p-5">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-text-secondary">Racha perdida</p>
        <p className="mt-1 text-[15px] text-text-primary">
          Perdiste una racha de {penalty.streakLost} {penalty.streakLost === 1 ? 'día' : 'días'}.
        </p>
        <div className="mt-3 flex gap-6">
          <div>
            <p className="text-[12px] text-text-secondary">Racha anterior</p>
            <p className="text-lg font-semibold text-text-primary">{penalty.streakLost} días</p>
          </div>
          <div>
            <p className="text-[12px] text-text-secondary">Racha actual</p>
            <p className="text-lg font-semibold text-text-primary">{streak.current} días</p>
          </div>
        </div>
      </div>
      <PenaltyCard penalty={penalty} />
      <RecoveryMissionCard />
    </motion.div>
  );
}
