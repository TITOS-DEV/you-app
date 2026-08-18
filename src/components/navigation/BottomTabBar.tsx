import { Home, ListChecks, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigationStore, type TabId } from '@/stores/navigationStore';
import { useSheetStore } from '@/stores/sheetStore';
import { useHaptics } from '@/hooks/useHaptics';

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'habitos', label: 'Hábitos', icon: ListChecks },
  { id: 'progreso', label: 'Progreso', icon: TrendingUp },
  { id: 'coach', label: 'Coach', icon: Sparkles },
];

export function BottomTabBar() {
  const activeTab = useNavigationStore((s) => s.activeTab);
  const setActiveTab = useNavigationStore((s) => s.setActiveTab);
  const openSheet = useSheetStore((s) => s.open);
  const vibrate = useHaptics();

  return (
    <nav
      className="glass-surface fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+10px)] z-40 flex items-center justify-between rounded-[28px] px-2 py-2"
      aria-label="Navegación principal"
    >
      {TABS.slice(0, 2).map((tab) => (
        <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
      ))}

      <button
        type="button"
        onClick={() => {
          vibrate('light');
          openSheet('quickAction');
        }}
        aria-label="Acción rápida"
        className="mx-1 flex h-14 w-14 shrink-0 -translate-y-3 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-lg transition-transform active:scale-95"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      {TABS.slice(2).map((tab) => (
        <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
      ))}
    </nav>
  );
}

function TabButton({
  tab,
  active,
  onClick,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2"
      aria-label={tab.label}
      aria-current={active ? 'page' : undefined}
    >
      {active && (
        <motion.div
          layoutId="tab-active-bg"
          className="absolute inset-0 rounded-2xl bg-surface-2/80"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <Icon
        className={cn('relative z-10 h-5 w-5', active ? 'text-accent' : 'text-text-tertiary')}
        strokeWidth={active ? 2.4 : 2}
      />
      <span className={cn('relative z-10 text-[10.5px] font-medium', active ? 'text-accent' : 'text-text-tertiary')}>
        {tab.label}
      </span>
    </button>
  );
}
