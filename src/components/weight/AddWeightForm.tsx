import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import * as weightService from '@/services/weightService';
import { todayKey } from '@/utils/date';
import { useToastStore } from '@/stores/toastStore';

interface AddWeightFormProps {
  onDone: () => void;
}

export function AddWeightForm({ onDone }: AddWeightFormProps) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(todayKey());
  const [time, setTime] = useState('');
  const [saving, setSaving] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const value = Number(weight.replace(',', '.'));
  const canSave = weight.length > 0 && value > 0 && !saving;

  async function handleSubmit() {
    if (!canSave) return;
    setSaving(true);
    await weightService.logWeight(value, date, time || undefined);
    setSaving(false);
    showToast('Peso registrado', 'success');
    onDone();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="weight-kg">Peso (kg)</Label>
        <Input
          id="weight-kg"
          type="number"
          inputMode="decimal"
          step="0.1"
          autoFocus
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="80.2"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="weight-date">Fecha</Label>
          <Input id="weight-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} max={todayKey()} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="weight-time">Hora (opcional)</Label>
          <Input id="weight-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <Button size="lg" disabled={!canSave} onClick={handleSubmit} className="mt-1">
        Guardar peso
      </Button>
    </div>
  );
}
