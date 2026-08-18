import { useLiveQuery } from 'dexie-react-hooks';
import * as analyticsService from '@/services/analyticsService';
import type { DateKey } from '@/types';

/** Dexie's liveQuery tracks every table touched while the query function
 * runs, so wrapping cross-table analytics functions here gives automatic
 * reactivity without hand-rolled subscriptions. */
export function useWeeklySummary() {
  return useLiveQuery(() => analyticsService.getWeeklySummary(), []);
}

export function useDailyCompletion(date?: DateKey) {
  return useLiveQuery(() => analyticsService.getDailyCompletion(date), [date]);
}

export function useDayStatus(date: DateKey) {
  return useLiveQuery(() => analyticsService.getDayStatus(date), [date]);
}

export function useBmi() {
  return useLiveQuery(() => analyticsService.getBMI(), []);
}

export function useWaterAverage(days = 7) {
  return useLiveQuery(() => analyticsService.getWaterAverage(days), [days]);
}

export function useBestWorstDay(days = 7) {
  return useLiveQuery(async () => {
    const [best, worst] = await Promise.all([
      analyticsService.getBestDay(days),
      analyticsService.getWorstDay(days),
    ]);
    return { best, worst };
  }, [days]);
}
