import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  days: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StreakBadge({ days, size = 'md', className }: StreakBadgeProps) {
  const sizes = {
    sm: 'text-[13px] gap-1 px-2.5 py-1',
    md: 'text-sm gap-1.5 px-3 py-1.5',
    lg: 'text-lg gap-2 px-4 py-2',
  } as const;
  const iconSizes = { sm: 14, md: 16, lg: 22 } as const;

  return (
    <motion.div
      key={days}
      initial={{ scale: 0.85, opacity: 0.6 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        days > 0 ? 'bg-warning/12 text-warning' : 'bg-surface-2 text-text-tertiary',
        sizes[size],
        className
      )}
    >
      <Flame size={iconSizes[size]} className={days > 0 ? 'fill-warning/30' : ''} />
      {days} {days === 1 ? 'día' : 'días'}
    </motion.div>
  );
}
