// src/components/layout/TopTabBar.tsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import {
  IconHome,
  IconWallet,
  IconSwap,
  IconSend,
  IconClock,
  IconGrid,
  IconChevronRight,
  IconChevronLeft,
  IconContrast,
  IconLogout,
} from "../../assets/icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

type Tab = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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

const NAV_LINK_CLASS_RAIL =
  "relative flex items-center justify-center w-full h-10 rounded-control transition-colors border-l-[3px]";
const NAV_LINK_CLASS_DRAWER =
  "flex items-center gap-3 px-3 py-2.5 rounded-control text-[14px] font-medium transition-colors border-l-[3px]";
const NAV_LINK_ACTIVE = "bg-violet-500/15 text-violet-300 border-violet-500";
const NAV_LINK_INACTIVE =
  "border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:bg-black/5 dark:hover:bg-white/5 hover:border-violet-500/40";

/**
 * Navegación de mobile (< lg) — reemplaza al viejo topbar horizontal.
 *
 * Es un riel angosto, solo íconos, siempre visible y pegado a la
 * izquierda (ocupa espacio real, como el Sidebar de desktop). Al tocar la
 * flechita se abre un drawer superpuesto (con overlay, no corre el
 * contenido de atrás) con las mismas opciones pero con etiqueta.
 */
export function TopTabBar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
  }

  return (
    <>
      <aside className="flex lg:hidden flex-col items-center shrink-0 w-16 h-screen sticky top-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark py-4 gap-1">
        <span className="brand-mark bg-ink dark:bg-white w-7 h-7 mb-2 shrink-0" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="w-9 h-9 flex items-center justify-center rounded-control text-text-light-tertiary dark:text-text-dark-tertiary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors mb-3"
        >
          <IconChevronRight className="w-4 h-4" />
        </button>

        <nav className="flex flex-col gap-1 w-full px-2">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                [NAV_LINK_CLASS_RAIL, isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE].join(" ")
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 w-full px-2">
          <button
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="flex items-center justify-center w-full h-10 rounded-control text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <IconContrast className="w-5 h-5 shrink-0" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="flex items-center justify-center w-full h-10 rounded-control text-magenta-500 hover:bg-magenta-500/10 transition-colors"
          >
            <IconLogout className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </aside>

      <div
        className={[
          "lg:hidden fixed inset-0 z-100 flex",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div
          className={[
            "absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ease-out",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <nav
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className={[
            "relative flex flex-col w-64 max-w-[80%] h-full bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark px-4 py-4 gap-1 shadow-elevation-lg overflow-y-auto transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="brand-mark bg-ink dark:bg-white w-7 h-7 shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="w-8 h-8 flex items-center justify-center rounded-control text-text-light-tertiary dark:text-text-dark-tertiary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [NAV_LINK_CLASS_DRAWER, isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE].join(" ")
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}

          <div className="mt-auto pt-4 flex flex-col gap-1">
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-control text-[14px] font-medium text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <IconContrast className="w-5 h-5 shrink-0" />
              {theme === "dark" ? "Modo claro" : "Modo oscuro"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-control text-[14px] font-medium text-magenta-500 hover:bg-magenta-500/10 transition-colors"
            >
              <IconLogout className="w-5 h-5 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
