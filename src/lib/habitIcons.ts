import {
  Apple,
  Bike,
  BookOpen,
  Brain,
  CheckCircle2,
  Coffee,
  Dumbbell,
  Footprints,
  Heart,
  Leaf,
  Moon,
  Music,
  Pencil,
  Smile,
  Sun,
  Target,
  Droplets,
  Waves,
  type LucideIcon,
} from 'lucide-react';

export const HABIT_ICONS: Record<string, LucideIcon> = {
  Droplets,
  Dumbbell,
  BookOpen,
  Footprints,
  Moon,
  Sun,
  Brain,
  Heart,
  Music,
  Pencil,
  Leaf,
  Apple,
  Coffee,
  Bike,
  Waves,
  Target,
  Smile,
  CheckCircle2,
};

export const HABIT_ICON_NAMES = Object.keys(HABIT_ICONS);

export function resolveHabitIcon(name: string): LucideIcon {
  return HABIT_ICONS[name] ?? CheckCircle2;
}

export const HABIT_COLORS = [
  '#6d5ef8',
  '#22b8cf',
  '#22a55e',
  '#e0a72b',
  '#e5484d',
  '#d6409f',
  '#8b5cf6',
  '#3b82f6',
];
