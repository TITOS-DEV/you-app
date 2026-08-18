import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { resolveHabitIcon } from '@/lib/habitIcons';
import { formatMinutes } from '@/services/exerciseService';
import { EXERCISE_TYPE_LABEL } from '@/types';
import type { DateKey } from '@/types';

export function DayDetailContent({ date }: { date: DateKey }) {
  const data = useLiveQuery(async () => {
    const [habits, logs, water, exercise, weight] = await Promise.all([
      db.habits.toArray(),
      db.habitLogs.where('date').equals(date).toArray(),
      db.waterEntries.where('date').equals(date).toArray(),
      db.exerciseEntries.where('date').equals(date).toArray(),
      db.weightEntries.where('date').equals(date).toArray(),
    ]);
    const logByHabit = new Map(logs.map((l) => [l.habitId, l]));
    return { habits, logByHabit, water, exercise, weight };
  }, [date]);

  if (!data) return null;

  const totalWaterMl = data.water.reduce((s, w) => s + w.amountMl, 0);
  const totalExerciseMin = data.exercise.reduce((s, e) => s + e.durationMin, 0);

  return (
    <div className="flex flex-col gap-5">
      <section>
        <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-text-secondary">Hábitos</h3>
        {data.habits.length === 0 ? (
          <p className="text-[13px] text-text-tertiary">Sin hábitos ese día.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {data.habits.map((h) => {
              const log = data.logByHabit.get(h.id);
              const Icon = resolveHabitIcon(h.icon);
              return (
                <div key={h.id} className="flex items-center gap-2.5 rounded-xl bg-surface-2 px-3 py-2">
                  <Icon size={15} className="text-text-secondary" />
                  <span className="flex-1 text-[13px] text-text-primary">{h.name}</span>
                  <span className={`text-[12px] font-medium ${log?.completed ? 'text-success' : 'text-text-tertiary'}`}>
                    {log?.completed ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-surface-2 p-3">
          <p className="text-[12px] text-text-secondary">Agua</p>
          <p className="text-[16px] font-semibold text-text-primary">{totalWaterMl} ml</p>
        </div>
        <div className="rounded-2xl bg-surface-2 p-3">
          <p className="text-[12px] text-text-secondary">Ejercicio</p>
          <p className="text-[16px] font-semibold text-text-primary">{formatMinutes(totalExerciseMin)}</p>
        </div>
      </section>

      {data.exercise.length > 0 && (
        <section className="flex flex-col gap-1.5">
          {data.exercise.map((e) => (
            <p key={e.id} className="text-[13px] text-text-secondary">
              {EXERCISE_TYPE_LABEL[e.type]} · {formatMinutes(e.durationMin)}
            </p>
          ))}
        </section>
      )}

      {data.weight.length > 0 && (
        <section>
          <p className="text-[13px] text-text-secondary">Peso registrado: {data.weight[0].weightKg} kg</p>
        </section>
      )}
    </div>
  );
}
