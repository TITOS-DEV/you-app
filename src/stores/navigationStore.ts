import { create } from 'zustand';

export type TabId = 'inicio' | 'habitos' | 'progreso' | 'coach';

interface NavigationState {
  activeTab: TabId;
  settingsOpen: boolean;
  /** Once true, stays true — lets the settings overlay mount lazily on
   * first open while remaining mounted afterwards so its own close
   * animation can play instead of being torn down mid-transition. */
  settingsEverOpened: boolean;
  setActiveTab: (tab: TabId) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: 'inicio',
  settingsOpen: false,
  settingsEverOpened: false,
  setActiveTab: (tab) => set({ activeTab: tab, settingsOpen: false }),
  openSettings: () => set({ settingsOpen: true, settingsEverOpened: true }),
  closeSettings: () => set({ settingsOpen: false }),
}));
