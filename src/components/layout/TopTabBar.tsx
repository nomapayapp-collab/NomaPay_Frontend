// src/components/layout/TopTabBar.tsx
import { NavLink } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import {
  IconHome,
  IconWallet,
  IconUpDown,
  IconSwap,
  IconSend,
  IconClock,
  IconGrid,
} from "../../assets/icons/Icons";

type Tab = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
};

const TABS: Tab[] = [
  { to: "/", label: "Inicio", icon: IconHome, end: true },
  { to: "/wallet", label: "Billetera", icon: IconWallet },
  { to: "/comprar-vender", label: "Comprar/Vender", icon: IconUpDown },
  { to: "/exchange", label: "Convertir", icon: IconSwap },
  { to: "/transfer", label: "Transferir", icon: IconSend },
  { to: "/history", label: "Historial", icon: IconClock },
  { to: "/summary", label: "Resumen", icon: IconGrid },
];

/**
 * Navegación superior de mobile (< lg) — reemplaza al viejo BottomTabBar.
 * Ícono + etiqueta siempre visibles (no tooltip: en touch no hay hover,
 * así que un tooltip nunca se activaría).
 */
export function TopTabBar() {
  return (
    <nav className="topbar lg:hidden ">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            ["topbar__item", isActive && "topbar__item--active"].filter(Boolean).join(" ")
          }
        >
          <Icon className="w-5 h-5" />
          <span className="topbar__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}