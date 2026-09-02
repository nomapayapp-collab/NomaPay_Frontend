import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { IconMenu, IconX } from "../../assets/icons/Icons";

const LINKS = [
  { label: "¿Cómo funciona?", href: "#como-funciona" },
  { label: "Para quién es", href: "#para-quien-es" },
  { label: "Preguntas", href: "#preguntas" },
  { label: "Contacto", href: "#contacto" },
];

export function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-surface-dark/95 backdrop-blur border-b border-border-dark">
      <div className="flex flex-wrap items-center justify-between px-6 md:px-12 py-4 gap-y-3">
        <Link to="/" className="flex items-center">
          <Logo variant="lockup-oscuro" className="h-8 w-auto" />
        </Link>

        {/* CTA: siempre visible, en mobile y desktop, afuera del menú colapsable */}
        <div className="flex items-center gap-3 md:order-2">
          <Link
            to="/login"
            className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors whitespace-nowrap"
          >
            Iniciar sesión
          </Link>
          <Button to="/register" variant="primary" size="sm">Crear cuenta</Button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden icon-btn"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Links de navegación: inline en desktop, colapsados en mobile */}
        <div
          className={`${menuOpen ? "flex" : "hidden"} md:flex md:order-1 w-full md:w-auto flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm text-text-dark-secondary`}
        >
          {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-text-dark-primary transition-colors">
                {l.label}
              </a>
            ))}
        </div>
      </div>
    </nav>
  );
}