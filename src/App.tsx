import { lazy, Suspense } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useNavigationStore } from '@/stores/navigationStore';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { SheetsRoot } from '@/components/navigation/SheetsRoot';
import { ToastViewport } from '@/components/ui/toast';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

// The dashboard is the very first thing a person sees, so it's the only
// page bundled eagerly. Everything else — including chart-heavy Progress —
// loads on demand, keeping first paint light.
const HabitsPage = lazy(() => import('@/features/habits/HabitsPage').then((m) => ({ default: m.HabitsPage })));
const ProgressPage = lazy(() => import('@/features/progress/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const CoachPage = lazy(() => import('@/features/coach/CoachPage').then((m) => ({ default: m.CoachPage })));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const PAGES = {
  inicio: DashboardPage,
  habitos: HabitsPage,
  progreso: ProgressPage,
  coach: CoachPage,
};

function App() {
  useTheme();
  const activeTab = useNavigationStore((s) => s.activeTab);
  // Settings mounts lazily on first open (tracked in the store, set from
  // the openSettings action rather than an effect) and stays mounted so
  // its own close animation can finish instead of unmounting mid-transition.
  const settingsEverOpened = useNavigationStore((s) => s.settingsEverOpened);
  const Page = PAGES[activeTab];

  return (
    <div className="min-h-dvh bg-surface-0">
      <main className="mx-auto max-w-lg pb-32">
        <Suspense fallback={null}>
          <Page />
        </Suspense>
      </main>

      <BottomTabBar />
      <SheetsRoot />
      {settingsEverOpened && (
        <Suspense fallback={null}>
          <SettingsPage />
        </Suspense>
      )}
      <ToastViewport />
    </div>
  );
}

export default App;
