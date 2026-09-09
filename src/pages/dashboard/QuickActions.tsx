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

const ACTION_BTN_CLASS =
  "group flex flex-col items-center gap-2 " +
  "text-text-light-secondary dark:text-text-dark-secondary " +
  "hover:text-text-light-primary dark:hover:text-text-dark-primary " +
  "transition-all duration-200 ease-out " +
  "lg:flex-row lg:gap-3 lg:px-5 lg:py-4 lg:rounded-card lg:border " +
  "lg:bg-surface-light-input dark:lg:bg-surface-dark-elevated lg:flex-1 " +
  "lg:hover:-translate-y-0.5 lg:hover:shadow-md";

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
            <span className="
                icon-btn icon-btn--lg border
                lg:border-0 lg:w-10 lg:h-10
                transition-all duration-200 ease-out
                group-hover:scale-110
              "
              style={{ borderColor: color }}>
              <Icon
                className="
                  w-6 h-6 lg:w-5 lg:h-5
                  transition-transform duration-200
                  group-hover:scale-110
                "
                color={color}
              />
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
            className="
              icon-btn icon-btn--lg border
              lg:border-0 lg:w-10 lg:h-10
              transition-all duration-200 ease-out
              group-hover:scale-110
            "
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
