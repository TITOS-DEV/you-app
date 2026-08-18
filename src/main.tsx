import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { useToastStore } from '@/stores/toastStore';
import * as settingsService from '@/services/settingsService';
import * as streakService from '@/services/streakService';

// Ensure the singleton settings row exists and streaks reflect today's
// state before the UI mounts — cheap, local, and keeps every screen
// consistent from first paint.
void settingsService.getSettings();
void streakService.syncGlobalStreak();

// Surface otherwise-silent async failures (a rejected Dexie/IndexedDB
// operation, a broken import) as a toast instead of losing them to the
// console — the person should know a save didn't happen.
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  useToastStore.getState().show('Algo no se guardó correctamente. Intenta de nuevo.', 'warning');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
