import { Link } from "react-router-dom";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";

const LINKS = [
  { label: "¿Cómo funciona?", href: "#como-funciona" },
  { label: "Para quién es", href: "#para-quien-es" },
  { label: "Preguntas", href: "#preguntas" },
  { label: "Contacto", href: "#contacto" },
];

export function LandingNavbar() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5">
      <Logo variant="lockup-oscuro" className="h-8 w-auto" />
      <div className="hidden md:flex items-center gap-8 text-sm text-text-dark-secondary">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="hover:text-text-dark-primary transition-colors">
            {l.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
          Iniciar sesión
        </Link>
        <Button to="/register" variant="primary">Crear cuenta</Button>
      </div>
    </nav>
  );
}