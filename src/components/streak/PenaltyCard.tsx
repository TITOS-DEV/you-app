import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as penaltyService from '@/services/penaltyService';
import { useToastStore } from '@/stores/toastStore';
import type { Penalty } from '@/types';

export function PenaltyCard({ penalty }: { penalty: Penalty }) {
  const showToast = useToastStore((s) => s.show);

  async function complete() {
    await penaltyService.completePenalty(penalty.id);
    showToast('Misión cumplida', 'success');
  }

  async function skip() {
    await penaltyService.skipPenalty(penalty.id);
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-1 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
          <HeartHandshake size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium text-text-primary">{penalty.title}</p>
          <p className="mt-0.5 text-[13px] text-text-secondary">{penalty.description}</p>
        </div>
      </div>
      {penalty.status !== 'completed' && penalty.status !== 'skipped' && (
        <div className="mt-3 flex gap-2 pl-12">
          <Button size="sm" onClick={complete}>
            Ya lo hice
          </Button>
          <Button size="sm" variant="ghost" onClick={skip}>
            Omitir
          </Button>
        </div>
      )}
    </div>
  );
}
