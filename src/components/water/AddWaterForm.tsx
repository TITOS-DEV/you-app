import { useState } from 'react';
import { Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { useHaptics } from '@/hooks/useHaptics';
import { useToastStore } from '@/stores/toastStore';
import * as waterService from '@/services/waterService';
import { WATER_PRESETS_ML } from '@/types';

interface AddWaterFormProps {
  onDone: () => void;
}

export function AddWaterForm({ onDone }: AddWaterFormProps) {
  const [custom, setCustom] = useState('');
  const vibrate = useHaptics();
  const showToast = useToastStore((s) => s.show);

  async function addAmount(ml: number) {
    if (ml <= 0) return;
    await waterService.addWater(ml);
    vibrate('success');
    showToast(`+${ml} ml de agua`, 'success');
    onDone();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-2.5">
        {WATER_PRESETS_ML.map((ml) => (
          <button
            key={ml}
            type="button"
            onClick={() => addAmount(ml)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border-subtle bg-surface-2 py-3.5 transition-transform active:scale-95"
          >
            <Droplets size={18} className="text-accent-2" />
            <span className="text-[13px] font-semibold text-text-primary">{ml} ml</span>
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2.5">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="custom-ml">Personalizado (ml)</Label>
          <Input
            id="custom-ml"
            type="number"
            inputMode="numeric"
            min={1}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="600"
          />
        </div>
        <Button variant="secondary" onClick={() => addAmount(Number(custom))} disabled={!custom}>
          Añadir
        </Button>
      </div>
    </div>
  );
}
