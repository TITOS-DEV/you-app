import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import * as waterService from '@/services/waterService';
import { formatWeekday } from '@/utils/date';
import { useSettings } from '@/hooks/useSettings';

export function WaterChart({ days = 7 }: { days?: number }) {
  const [history, setHistory] = useState<{ date: string; ml: number }[]>([]);
  const settings = useSettings();

  useEffect(() => {
    let cancelled = false;
    waterService.getWaterHistory(days).then((data) => {
      if (!cancelled) setHistory(data);
    });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const data = history.map((d) => ({ ...d, label: formatWeekday(d.date) }));

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: 'var(--surface-2)' }}
            contentStyle={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
            formatter={(value) => [`${value} ml`, 'Agua']}
          />
          <Bar dataKey="ml" radius={[8, 8, 8, 8]} fill="var(--accent-2)" maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-center text-[12px] text-text-tertiary">Meta diaria: {settings.waterGoalMl} ml</p>
    </div>
  );
}
