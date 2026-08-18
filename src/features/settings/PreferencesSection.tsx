import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/input';
import { useSettings } from '@/hooks/useSettings';
import * as settingsService from '@/services/settingsService';
import type { ThemeMode, UnitSystem } from '@/types';

const THEME_LABEL: Record<ThemeMode, string> = { light: 'Claro', dark: 'Oscuro', system: 'Sistema' };
const UNITS_LABEL: Record<UnitSystem, string> = { metric: 'Métrico (kg, cm)', imperial: 'Imperial (lb, in)' };

export function PreferencesSection() {
  const settings = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Tema</Label>
        <Select value={settings.theme} onValueChange={(v: ThemeMode) => settingsService.updateSettings({ theme: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(THEME_LABEL) as ThemeMode[]).map((t) => (
              <SelectItem key={t} value={t}>
                {THEME_LABEL[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Unidades</Label>
        <Select value={settings.units} onValueChange={(v: UnitSystem) => settingsService.updateSettings({ units: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(UNITS_LABEL) as UnitSystem[]).map((u) => (
              <SelectItem key={u} value={u}>
                {UNITS_LABEL[u]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
