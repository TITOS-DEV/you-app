import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border-strong px-6 py-12 text-center', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-text-secondary">
        {icon}
      </div>
      <p className="text-[15px] font-medium text-text-primary">{title}</p>
      {description && <p className="max-w-xs text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
