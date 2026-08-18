import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, startOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { dateKey, todayKey } from '@/utils/date';
import * as analyticsService from '@/services/analyticsService';
import { useSheetStore } from '@/stores/sheetStore';
import type { DayStatus } from '@/types';

const STATUS_COLOR: Record<DayStatus, string> = {
  complete: 'bg-success',
  partial: 'bg-warning',
  incomplete: 'bg-danger',
  empty: 'bg-border-strong',
};

export function ActivityCalendar() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const openSheet = useSheetStore((s) => s.open);

  const days = useMemo(() => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }), [month]);
  const leadingBlanks = (getDay(startOfMonth(month)) + 6) % 7; // Monday-first grid

  const statusByDate = useLiveQuery(async () => {
    const entries = await Promise.all(
      days.map(async (d) => {
        const key = dateKey(d);
        const status = await analyticsService.getDayStatus(key);
        return [key, status] as const;
      })
    );
    return new Map(entries);
  }, [days.map((d) => dateKey(d)).join(',')]);

  const today = todayKey();

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-1 p-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setMonth((m) => subMonths(m, 1))} aria-label="Mes anterior" className="p-1.5 text-text-secondary">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-[14px] font-semibold capitalize text-text-primary">{format(month, 'MMMM yyyy', { locale: es })}</p>
        <button onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Mes siguiente" className="p-1.5 text-text-secondary">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-y-2 text-center">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
          <span key={d} className="text-[10.5px] font-medium text-text-tertiary">
            {d}
          </span>
        ))}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {days.map((d) => {
          const key = dateKey(d);
          const status = statusByDate?.get(key) ?? 'empty';
          return (
            <button
              key={key}
              onClick={() => openSheet('dayDetail', { date: key })}
              className="flex flex-col items-center gap-1 py-0.5"
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-[12px]',
                  key === today ? 'ring-2 ring-accent text-text-primary' : 'text-text-secondary'
                )}
              >
                {d.getDate()}
              </span>
              <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLOR[status])} />
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-text-tertiary">
        <Legend color="bg-success" label="Completo" />
        <Legend color="bg-warning" label="Parcial" />
        <Legend color="bg-danger" label="Incompleto" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-1.5 w-1.5 rounded-full', color)} />
      {label}
    </span>
  );
}
