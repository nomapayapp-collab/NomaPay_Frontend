import { useState, type ComponentType, type SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import { IconSend, IconSwap, IconPlus } from "../../assets/icons/Icons";
import { TopUpModal } from "../../components/wallet/TopUpModal";

type NavAction = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  to: string;
  color: string;
};

const NAV_ACTIONS: NavAction[] = [
  { label: "Transferir", icon: IconSend, to: "/transfer", color: "var(--color-violet-300)" },
  { label: "Convertir", icon: IconSwap, to: "/exchange", color: "var(--color-turquoise-500)" },
];

// El border-color de cada botón sale del mismo "color" que ya tenía su
// ícono (era la única razón de ser de esa prop) — por eso ACTION_BTN_CLASS
// ya no trae un color de borde fijo, se aplica por botón vía style.
const ACTION_BTN_CLASS =
  "flex flex-col items-center gap-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary " +
  "lg:flex-row lg:gap-3 lg:px-5 lg:py-4 lg:rounded-card lg:border " +
  "lg:bg-surface-light-input dark:lg:bg-surface-dark-elevated lg:flex-1";

export function QuickActions() {
  const navigate = useNavigate();
  const [topUpOpen, setTopUpOpen] = useState(false);

  return (
    <>
      <div className="flex justify-around py-2 lg:justify-start lg:gap-4">
        {NAV_ACTIONS.map(({ label, icon: Icon, to, color }) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(to)}
            className={ACTION_BTN_CLASS}
            style={{ borderColor: color }}
          >
            {/* en mobile no hay pill con borde (eso arranca en lg:), así que
                el aro de color va directo en el círculo del ícono; en
                desktop se apaga (lg:border-0) porque ya lo da el botón. */}
            <span className="icon-btn icon-btn--lg border lg:border-0 lg:w-10 lg:h-10" style={{ borderColor: color }}>
              <Icon className="w-6 h-6 lg:w-5 lg:h-5" color={color} />
            </span>
            <span className="text-[12.5px] font-medium lg:text-[14px]">{label}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setTopUpOpen(true)}
          className={ACTION_BTN_CLASS}
          style={{ borderColor: "var(--color-amber-500)" }}
        >
          <span
            className="icon-btn icon-btn--lg border lg:border-0 lg:w-10 lg:h-10"
            style={{ borderColor: "var(--color-amber-500)" }}
          >
            <IconPlus className="w-6 h-6 lg:w-5 lg:h-5" color="var(--color-amber-500)" />
          </span>
          <span className="text-[12.5px] font-medium lg:text-[14px]">Cargar saldo</span>
        </button>
      </div>

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </>
  );
}
