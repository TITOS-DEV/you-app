import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/** Bottom sheet — the primary Liquid Glass surface for quick actions and
 * forms. Respects safe-area insets so it never sits under the home
 * indicator on iPhone. */
export function Sheet({ open, onOpenChange, title, description, children, className }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-[var(--surface-overlay)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={description ? 'sheet-description' : undefined}>
              <motion.div
                className={cn(
                  'glass-surface fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] p-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] max-h-[85dvh] overflow-y-auto no-scrollbar',
                  className
                )}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              >
                <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border-strong" aria-hidden />
                <Dialog.Title className="text-lg font-semibold text-text-primary">{title}</Dialog.Title>
                {description && (
                  <Dialog.Description id="sheet-description" className="mt-1 text-sm text-text-secondary">
                    {description}
                  </Dialog.Description>
                )}
                <div className="mt-4">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
