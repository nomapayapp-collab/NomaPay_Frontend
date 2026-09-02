import { Link } from "react-router-dom";
import { Logo } from "../../components/ui/Logo";

export function LandingFooter() {
  return (
    <footer id="contacto" className="bg-surface-dark px-6 md:px-12 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="lockup-oscuro" className="h-8 w-auto" />
          </Link>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-dark-secondary">
            <li>
              <a href="#como-funciona" className="hover:text-text-dark-primary transition-colors">
                ¿Cómo funciona?
              </a>
            </li>
            <li>
              <a href="#para-quien-es" className="hover:text-text-dark-primary transition-colors">
                Para quién es
              </a>
            </li>
            <li>
              <a href="#preguntas" className="hover:text-text-dark-primary transition-colors">
                Preguntas
              </a>
            </li>
            <li>
              <Link to="/politica-de-privacidad" className="hover:text-text-dark-primary transition-colors">
                Política de privacidad
              </Link>
            </li>
            <li>
              <a href="mailto:nomapayapp@gmail.com" className="hover:text-text-dark-primary transition-colors">
                Contacto: nomapayapp@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <hr className="my-6 border-border-dark" />

        <p className="text-xs text-text-dark-tertiary text-center">
          © {new Date().getFullYear()} NomaPay. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}