import { create } from 'zustand';
import { createId } from '@/lib/utils';

export interface ToastItem {
  id: string;
  message: string;
  tone: 'default' | 'success' | 'warning';
}

interface ToastState {
  toasts: ToastItem[];
  show: (message: string, tone?: ToastItem['tone']) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, tone = 'default') => {
    const id = createId();
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2800);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
