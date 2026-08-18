import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import * as weightService from '@/services/weightService';
import { formatShortDate } from '@/utils/date';
import type { WeightEntry, WeightRange } from '@/types';

const RANGES: { value: WeightRange; label: string }[] = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '3m', label: '3m' },
  { value: '6m', label: '6m' },
  { value: 'all', label: 'Todo' },
];

export function WeightChart() {
  const [range, setRange] = useState<WeightRange>('30d');
  const [entries, setEntries] = useState<WeightEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    weightService.getWeightHistory(range).then((data) => {
      if (!cancelled) setEntries(data);
    });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const data = entries.map((e) => ({ date: e.date, kg: e.weightKg, label: formatShortDate(e.date) }));
  const values = data.map((d) => d.kg);
  const min = values.length ? Math.min(...values) - 1 : 0;
  const max = values.length ? Math.max(...values) + 1 : 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
              range === r.value ? 'bg-accent text-accent-contrast' : 'bg-surface-2 text-text-secondary'
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {data.length < 2 ? (
        <div className="flex h-44 items-center justify-center text-[13px] text-text-tertiary">
          Registra al menos dos pesos para ver tu evolución.
        </div>
      ) : (
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} minTickGap={24} />
              <YAxis domain={[min, max]} hide />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: 'var(--text-primary)',
                }}
                formatter={(value) => [`${value} kg`, 'Peso']}
              />
              <Area type="monotone" dataKey="kg" stroke="var(--accent)" strokeWidth={2.5} fill="url(#weightFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
