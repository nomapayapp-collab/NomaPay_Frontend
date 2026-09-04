import { Component, type ReactNode } from "react";
import { Logo } from "./ui/Logo";
import { Button } from "./ui/Button";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

/**
 * ErrorBoundary — ataja errores de render que antes rompían la app entera
 * sin ningún fallback visual (como pasó con BalanceCard). Tiene que ser un
 * componente de clase: React todavía no expone un hook para esto.
 * Se envuelve una sola vez, en App.tsx.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("Error de render capturado por ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-light dark:bg-surface-dark px-6 text-center">
          <Logo variant="lockup-oscuro" className="w-36 h-auto opacity-90 hidden dark:block" />
          <Logo variant="lockup-claro" className="w-36 h-auto opacity-90 block dark:hidden" />
          <div>
            <h1 className="title">Algo salió mal</h1>
            <p className="subtitle mt-1">Probá recargar la página. Si el error sigue, avisanos.</p>
          </div>
          <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}