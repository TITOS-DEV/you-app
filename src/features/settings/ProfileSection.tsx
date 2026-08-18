import { useState } from 'react';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';
import * as settingsService from '@/services/settingsService';
import { useToastStore } from '@/stores/toastStore';

export function ProfileSection() {
  const settings = useSettings();
  const [form, setForm] = useState(() => ({
    name: settings.name,
    age: settings.age?.toString() ?? '',
    heightCm: settings.heightCm?.toString() ?? '',
    weightGoalKg: settings.weightGoalKg?.toString() ?? '',
    waterGoalMl: settings.waterGoalMl.toString(),
  }));
  const showToast = useToastStore((s) => s.show);

  async function save() {
    await settingsService.updateSettings({
      name: form.name.trim(),
      age: form.age ? Number(form.age) : undefined,
      heightCm: form.heightCm ? Number(form.heightCm) : undefined,
      weightGoalKg: form.weightGoalKg ? Number(form.weightGoalKg) : undefined,
      waterGoalMl: form.waterGoalMl ? Number(form.waterGoalMl) : settings.waterGoalMl,
    });
    showToast('Perfil actualizado', 'success');
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="Nombre" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Tu nombre" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Edad" type="number" value={form.age} onChange={(v) => setForm((f) => ({ ...f, age: v }))} />
        <Field label="Altura (cm)" type="number" value={form.heightCm} onChange={(v) => setForm((f) => ({ ...f, heightCm: v }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Peso objetivo (kg)" type="number" value={form.weightGoalKg} onChange={(v) => setForm((f) => ({ ...f, weightGoalKg: v }))} />
        <Field label="Objetivo de agua (ml)" type="number" value={form.waterGoalMl} onChange={(v) => setForm((f) => ({ ...f, waterGoalMl: v }))} />
      </div>
      <Button onClick={save}>Guardar perfil</Button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
