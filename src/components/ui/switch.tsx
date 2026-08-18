import type { ComponentProps } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export function Switch({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full bg-border-strong transition-colors data-[state=checked]:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block h-[22px] w-[22px] translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 data-[state=checked]:translate-x-[22px]" />
    </SwitchPrimitive.Root>
  );
}
