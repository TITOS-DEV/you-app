import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * The one true "Liquid Glass" surface. Reserved for navigation, floating
 * controls, sheets and modals — never for regular content cards, which
 * stay opaque and calm (see `Card`).
 */
export function GlassCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass-surface rounded-3xl', className)} {...props} />;
}
