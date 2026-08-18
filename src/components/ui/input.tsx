import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-2xl border border-border-subtle bg-surface-2 px-4 text-[15px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-accent/60',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn('text-[13px] font-medium text-text-secondary', className)} {...props} />
  )
);
Label.displayName = 'Label';
