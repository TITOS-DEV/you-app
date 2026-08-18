import { motion } from 'framer-motion';
import { Lightbulb, MessageCircleQuestion, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as coachService from '@/services/coachService';
import type { CoachMessage } from '@/types';

const ICONS = {
  insight: Lightbulb,
  question: MessageCircleQuestion,
  recommendation: Sparkles,
  recovery: RotateCcw,
} as const;

const TONES = {
  insight: 'bg-accent/10 text-accent',
  question: 'bg-accent-2/10 text-accent-2',
  recommendation: 'bg-warning/10 text-warning',
  recovery: 'bg-success/10 text-success',
} as const;

export function CoachMessageCard({ message }: { message: CoachMessage }) {
  const Icon = ICONS[message.type];

  async function answer(value: 'yes' | 'later') {
    await coachService.answerCoachMessage(message.id, value);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border-subtle bg-surface-1 p-4"
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl', TONES[message.type])}>
          <Icon size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-snug text-text-primary">{message.text}</p>
          {message.question && (
            <p className="mt-1.5 text-[14px] font-medium leading-snug text-text-primary">{message.question}</p>
          )}
        </div>
      </div>

      {message.question && !message.answered && (
        <div className="mt-3 flex gap-2 pl-12">
          <Button size="sm" variant="secondary" onClick={() => answer('yes')}>
            Sí
          </Button>
          <Button size="sm" variant="ghost" onClick={() => answer('later')}>
            Ahora no
          </Button>
        </div>
      )}
      {message.question && message.answered && (
        <p className="mt-2 pl-12 text-[12px] text-text-tertiary">
          {message.answer === 'yes' ? 'Marcado como objetivo.' : 'Quedó anotado para después.'}
        </p>
      )}
    </motion.div>
  );
}
