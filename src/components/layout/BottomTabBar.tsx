import { NavLink } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import { IconHome, IconWallet, IconSwap, IconSend, IconClock, IconGrid } from "../../assets/icons/Icons";

/**
 * navegación inferior fija de toda pantalla logueada.
 * Cada página que la necesite la monta ella misma al final
 */
type Tab = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** solo Inicio, para que "/" no quede marcado como activo en todas las rutas */
  end?: boolean;
};

const TABS: Tab[] = [
  { to: "/", label: "Inicio", icon: IconHome, end: true },
  { to: "/wallet", label: "Billetera", icon: IconWallet },
  { to: "/exchange", label: "Convertir", icon: IconSwap },
  { to: "/transfer", label: "Transferir", icon: IconSend },
  { to: "/history", label: "Historial", icon: IconClock },
  { to: "/summary", label: "Resumen", icon: IconGrid },
];

export function BottomTabBar() {
  return (
    <nav className="tabbar">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            ["tabbar__item", isActive && "tabbar__item--active"].filter(Boolean).join(" ")
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}