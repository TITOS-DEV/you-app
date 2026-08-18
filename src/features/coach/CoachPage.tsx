import { Sparkles } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { CoachMessageCard } from '@/components/coach/CoachMessageCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useCoachMessages } from '@/hooks/useCoach';
import * as coachService from '@/services/coachService';

export function CoachPage() {
  const messages = useCoachMessages();

  async function askSomething() {
    const question = await coachService.pickSmartQuestion();
    await coachService.saveCoachMessages([question]);
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <AppHeader title="Coach" subtitle="Un espacio para pensar en tu progreso." />

      <div className="flex flex-col gap-4 px-5">
        <Button variant="secondary" onClick={askSomething} className="w-full">
          <Sparkles className="h-4 w-4" /> Nueva reflexión
        </Button>

        {messages.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title="Todavía no hay observaciones."
            description="A medida que registres tus días, el Coach empezará a compartir hallazgos aquí."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <CoachMessageCard key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
