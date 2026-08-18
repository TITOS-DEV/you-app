import { create } from 'zustand';

export type SheetId =
  | 'quickAction'
  | 'addWater'
  | 'addWeight'
  | 'addExercise'
  | 'habitForm'
  | 'dayDetail'
  | null;

interface SheetState {
  sheet: SheetId;
  payload: unknown;
  open: (sheet: Exclude<SheetId, null>, payload?: unknown) => void;
  close: () => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  sheet: null,
  payload: undefined,
  open: (sheet, payload) => set({ sheet, payload }),
  close: () => set({ sheet: null, payload: undefined }),
}));
