import { Component, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Last-resort guard so a render crash (corrupted data, a bad chart value)
 * shows a calm recovery screen instead of a blank app. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('YOU crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface-0 px-8 text-center">
          <p className="text-lg font-semibold text-text-primary">Algo salió mal.</p>
          <p className="text-sm text-text-secondary">
            Tus datos siguen guardados en este dispositivo. Intenta recargar la app.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RotateCcw className="h-4 w-4" /> Recargar
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
