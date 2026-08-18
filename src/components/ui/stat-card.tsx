import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function StatCard({ icon, label, value, sub, className, onClick }: StatCardProps) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-2 rounded-3xl border border-border-subtle bg-surface-1 p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        onClick && 'transition-transform active:scale-[0.98]',
        className
      )}
    >
      <div className="flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-text-primary">{value}</div>
      {sub && <div className="text-[13px] text-text-secondary">{sub}</div>}
    </Comp>
  );
}
