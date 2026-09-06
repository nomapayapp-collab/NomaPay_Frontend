import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";

/**
 * 404 — se muestra para cualquier ruta que no exista. Antes no había
 * ninguna, así que entrar a una URL rota dejaba la pantalla en blanco.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-light dark:bg-surface-dark px-6 text-center">
      <Logo variant="lockup-oscuro" className="w-36 h-auto opacity-90 hidden dark:block" />
      <Logo variant="lockup-claro" className="w-36 h-auto opacity-90 block dark:hidden" />
      <div>
        <p
          className="text-[80px] font-extrabold leading-none bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-swoosh)" }}
        >
          404
        </p>
        <h1 className="title mt-2">Esta página no se encontró</h1>
        <p className="subtitle mt-1">Revisá el link o volvé al inicio.</p>
      </div>
      <Button to="/" variant="primary" className="mt-4">
        Volver al inicio
      </Button>
    </div>
  );
}