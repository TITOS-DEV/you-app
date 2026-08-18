import { AppHeader } from '@/components/layout/AppHeader';
import { HabitList } from '@/components/habits/HabitList';
import { StreakLostBanner } from '@/components/streak/StreakLostBanner';
import { DailySummaryCard } from '@/features/dashboard/DailySummaryCard';
import { useSettings } from '@/hooks/useSettings';
import { useNavigationStore } from '@/stores/navigationStore';
import { dailyPhrase } from '@/lib/messages';
import { greetingForNow } from '@/utils/date';

export function DashboardPage() {
  const settings = useSettings();
  const setActiveTab = useNavigationStore((s) => s.setActiveTab);
  const greeting = greetingForNow();
  const name = settings.name?.trim();

  return (
    <div className="flex flex-col gap-6 pb-6">
      <AppHeader
        title={name ? `${greeting}, ${name}` : greeting}
        subtitle={dailyPhrase()}
      />

      <div className="flex flex-col gap-5 px-5">
        <StreakLostBanner />

        <DailySummaryCard />

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-text-primary">Hoy</h2>
            <button
              onClick={() => setActiveTab('habitos')}
              className="text-[13px] font-medium text-accent"
            >
              Ver todos
            </button>
          </div>
          <HabitList limit={5} />
        </section>
      </div>
    </div>
  );
}
