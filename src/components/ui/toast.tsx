import { AnimatePresence, motion } from 'framer-motion';
import { Check, TriangleAlert } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';
import { cn } from '@/lib/utils';

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+12px)] z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className={cn(
              'glass-surface pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-text-primary shadow-lg'
            )}
          >
            {t.tone === 'success' && <Check className="h-4 w-4 text-success" />}
            {t.tone === 'warning' && <TriangleAlert className="h-4 w-4 text-warning" />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
