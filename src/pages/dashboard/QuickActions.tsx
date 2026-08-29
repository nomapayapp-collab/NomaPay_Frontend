import type { ComponentType, SVGProps } from "react";
import { IconSend, IconSwap } from "../../assets/icons/Icons";

type Action = { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const ACTIONS: Action[] = [
  { label: "Transferir", icon: IconSend },
  { label: "Cambiar", icon: IconSwap },
];

export function QuickActions() {
  return (
    <div className="flex justify-around py-2">
      {ACTIONS.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="flex flex-col items-center gap-2 text-text-dark-secondary hover:text-text-dark-primary"
        >
          <span className="icon-btn icon-btn--lg">
            <Icon className="w-6 h-6" />
          </span>
          <span className="text-[12.5px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}