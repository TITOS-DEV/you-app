import {
  addDays,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfWeek,
  subDays,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { DateKey } from '@/types';

/** Local calendar day key, e.g. "2026-08-18". Never use UTC methods here —
 * a person's "today" is their local day, not UTC's. */
export function dateKey(date: Date = new Date()): DateKey {
  return format(date, 'yyyy-MM-dd');
}

export function todayKey(): DateKey {
  return dateKey(new Date());
}

export function parseDateKey(key: DateKey): Date {
  return parseISO(key);
}

export function isToday(key: DateKey): boolean {
  return key === todayKey();
}

export function formatFriendlyDate(key: DateKey): string {
  return format(parseDateKey(key), "d 'de' MMMM", { locale: es });
}

export function formatWeekday(key: DateKey): string {
  return format(parseDateKey(key), 'EEEEEE', { locale: es });
}

export function formatShortDate(key: DateKey): string {
  return format(parseDateKey(key), 'd MMM', { locale: es });
}

export function lastNDays(n: number, from: Date = new Date()): DateKey[] {
  const end = startOfDay(from);
  const start = subDays(end, n - 1);
  return eachDayOfInterval({ start, end }).map((d) => dateKey(d));
}

export function daysAgo(n: number, from: Date = new Date()): DateKey {
  return dateKey(subDays(from, n));
}

export function daysBetween(a: DateKey, b: DateKey): number {
  const diff = parseDateKey(a).getTime() - parseDateKey(b).getTime();
  return Math.round(diff / 86_400_000);
}

export function isConsecutiveDay(prev: DateKey, next: DateKey): boolean {
  return daysBetween(next, prev) === 1;
}

export function currentWeekStart(from: Date = new Date()): Date {
  return startOfWeek(from, { weekStartsOn: 1 });
}

export function greetingForNow(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export { isSameDay, addDays, subDays, format };
