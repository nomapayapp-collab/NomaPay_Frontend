import { Logo } from "../ui/Logo";
import { IconCheck } from "../../assets/icons/Icons";

const FEATURES = ["3 divisas en una sola cuenta", "1 billetera para tu dinero", "Acceso 24/7, estés donde estés"];

/**
 * Panel de marca del lado izquierdo en Login/Register, solo desktop (lg+).
 * En mobile no se renderiza — el logo va arriba del formulario, como siempre.
 */
export function AuthBrandPanel() {
  const year = new Date().getFullYear();

  return (
    <aside
      className="hidden lg:flex lg:w-[42%] lg:min-w-100 lg:flex-col lg:justify-between bg-surface-dark-base px-12 py-10 relative overflow-hidden"
      style={{ backgroundImage: "var(--gradient-aura)" }}
    >
      <Logo variant="lockup-oscuro" className="w-40 h-auto" />

      <div>
        <h1 className="text-[34px] leading-[1.15] font-extrabold text-white mb-4">
          Cobrá global.
          <br />
          Viví local.
        </h1>
        <p className="text-[15px] text-text-dark-secondary max-w-sm mb-6">
          Trabajá donde quieras y cobrá desde cualquier parte del mundo. Una sola cuenta para recibir,
          convertir y usar tu dinero.
        </p>
        <ul className="flex flex-col gap-2.5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[14px] font-medium text-white">
              <IconCheck className="w-4 h-4 text-turquoise-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-text-dark-tertiary">Entidad de pago registrada · {year}</span>
        <div className="brand-rule w-24" />
      </div>
    </aside>
  );
}