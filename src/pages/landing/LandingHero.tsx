import { Button } from "../../components/ui/Button";
import { IconCheck, IconChevronRight } from "../../assets/icons/Icons";
import { WorldNetworkBackground } from "./WorldNetworkBackground";
import heroPhones from "../../assets/img/mockup-phone-02.png";

const BULLETS = [
  "Recibí pagos internacionales en 3 países",
  "Convertí a tu divisa local con tasa a la vista",
  "Usá tu dinero desde el celular, sin trámites",
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden min-h-150 px-6 md:px-12 py-10 md:py-16">
      <WorldNetworkBackground />

      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center h-full">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-turquoise-500 font-semibold mb-4">
            Cobrá global. Viví local.
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            <span className="text-text-dark-primary">Tu plata,</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-swoosh)" }}>
              sin fronteras.
            </span>
          </h1>
          <p className="text-base text-text-dark-secondary max-w-md mb-6">
            Trabajá donde quieras y cobrá desde cualquier parte del mundo. Una
            sola cuenta para recibir, convertir y usar tu dinero.
          </p>
          <ul className="flex flex-col gap-2 mb-8">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-text-dark-secondary">
                <IconCheck className="w-4 h-4 text-turquoise-500 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button to="/register" variant="primary">Crear mi cuenta gratis</Button>
            <Button to="#como-funciona" variant="ghost">
              Ver cómo funciona <IconChevronRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <img
            src={heroPhones}
            alt="Pantallas de NomaPay: Billetera y Convertir"
            className="relative w-85 md:w-100 h-auto animate-float"
          />
        </div>
      </div>
    </section>
  );
}