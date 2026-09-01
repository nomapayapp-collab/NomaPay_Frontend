import type { ComponentType, SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import { IconSend, IconSwap } from "../../assets/icons/Icons";

type Action = { label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; to: string };

const ACTIONS: Action[] = [
  { label: "Transferir", icon: IconSend, to: "/transfer" },
  { label: "Convertir", icon: IconSwap, to: "/exchange" },
];

/**
 * Accesos rápidos del dashboard. El mockup de desktop suma "Cerca tuyo" y
 * "Cargar saldo", pero esas dos todavía no son funcionalidades reales
 * (necesitan geolocalización de comercios y un flujo de depósito que no
 * existen) — quedan comentadas más abajo en vez de simuladas.
 */
export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-around py-2 lg:justify-start lg:gap-4">
      {ACTIONS.map(({ label, icon: Icon, to }) => (
        <button
          key={label}
          type="button"
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-2 text-text-dark-secondary hover:text-text-dark-primary
                     lg:flex-row lg:gap-3 lg:px-5 lg:py-4 lg:rounded-card lg:border lg:border-border-dark
                     lg:bg-surface-dark-elevated lg:hover:border-violet-500/40 lg:flex-1"
        >
          <span className="icon-btn icon-btn--lg lg:w-10 lg:h-10">
            <Icon className="w-6 h-6 lg:w-5 lg:h-5" />
          </span>
          <span className="text-[12.5px] font-medium lg:text-[14px]">{label}</span>
        </button>
      ))}

      {/* TODO(desktop): "Cerca tuyo" (comercios/cajeros cercanos — necesita
          geolocalización y una base de comercios que no existe) y "Cargar saldo"
          (flujo de depósito, sin endpoint todavía). Del mockup, van acá cuando
          estén listas del lado del back:
      <button className="..."><IconPin className="..." />Cerca tuyo</button>
      <button className="..."><IconPlus className="..." />Cargar saldo</button>
      */}
    </div>
  );
}