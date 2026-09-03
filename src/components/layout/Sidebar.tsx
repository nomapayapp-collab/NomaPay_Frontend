import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import {
  IconHome,
  IconWallet,
  IconSwap,
  IconSend,
  IconClock,
  IconGrid,
  IconCopy,
  IconCheck,
  IconChevronRight,
} from "../../assets/icons/Icons";
import { Logo } from "../ui/Logo";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../hooks/useAuth";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Inicio", icon: IconHome, end: true },
  { to: "/wallet", label: "Billetera", icon: IconWallet },
  { to: "/exchange", label: "Convertir", icon: IconSwap },
  { to: "/transfer", label: "Transferir", icon: IconSend },
  { to: "/history", label: "Historial", icon: IconClock },
  { to: "/summary", label: "Resumen", icon: IconGrid },
];

/**
 * Navegación lateral fija de desktop (lg+) — equivalente al BottomTabBar de
 * mobile. Se monta en las mismas pantallas que ya montan el tabbar.
 */
export function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  async function handleCopyAlias() {
    if (!user?.alias) return;
    try {
      await navigator.clipboard.writeText(user.alias);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // portapapeles no disponible (permiso denegado, contexto no seguro, etc.)
    }
  }

  return (
    <aside className="hidden lg:flex lg:w-64 lg:min-w-56 lg:flex-col lg:shrink-0 lg:h-screen lg:sticky lg:top-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark px-5 py-6">
      <Logo variant="lockup-oscuro" className="w-32 h-auto mb-8 px-2 hidden dark:block" />
      <Logo variant="lockup-claro" className="w-32 h-auto mb-8 px-2 block dark:hidden" />

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2.5 rounded-control text-[14px] font-medium transition-colors",
                isActive
                  ? "bg-violet-500/15 text-violet-300"
                  : "text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:bg-black/5 dark:hover:bg-white/5",
              ].join(" ")
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {user?.alias && (
        <div className="mt-8">
          <p className="card__title mb-2">Recibir dinero</p>
          <div className="rounded-control border border-dashed border-border-light dark:border-border-dark p-3">
            <p className="text-[13.5px] font-semibold text-text-light-primary dark:text-text-dark-primary truncate mb-2">
              {user.alias}</p>
            <button type="button" onClick={handleCopyAlias} className="btn btn--outline btn--sm w-full">
              {copied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-control hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <Avatar user={user} size="sm" />
          <span className="flex-1 text-left text-[13.5px] font-medium text-text-light-primary dark:text-text-dark-primary truncate">
            {user ? `${user.name} ${user.surname}` : ""}
          </span>
          <IconChevronRight className="w-4 h-4 text-text-light-tertiary dark:text-text-dark-tertiary" />        </button>
      </div>
    </aside>
  );
}