import type { ReactNode } from 'react';
import { Settings } from 'lucide-react';
import { useNavigationStore } from '@/stores/navigationStore';

interface AppHeaderProps {
  title: string;
  subtitle?: ReactNode;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const openSettings = useNavigationStore((s) => s.openSettings);

  return (
    <header className="flex items-start justify-between px-5 pt-[calc(env(safe-area-inset-top,0px)+18px)]">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-text-primary">{title}</h1>
        {subtitle && <div className="mt-1 text-[15px] text-text-secondary">{subtitle}</div>}
      </div>
      <button
        type="button"
        onClick={openSettings}
        aria-label="Ajustes"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-secondary transition-transform active:scale-95"
      >
        <Settings className="h-[18px] w-[18px]" />
      </button>
    </header>
  );
}
