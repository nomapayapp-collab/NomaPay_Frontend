import { Logo } from "../components/ui/Logo";

/**
 * pantalla de bienvenida que se ve un momento al abrir
 * la app.
 */
export default function Splash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-light dark:bg-surface-dark px-6 text-center">
      <Logo variant="lockup-oscuro" className="w-48 h-auto hidden dark:block" />
      <Logo variant="lockup-claro" className="w-48 h-auto block dark:hidden" />
      <div>
        <h1 className="title">Bienvenido a NomaPay</h1>
        <p className="subtitle mt-1">Cobrá global. Viví local.</p>
      </div>
      <div className="brand-rule w-40 mt-6 animate-pulse" />
    </div>
  );
}