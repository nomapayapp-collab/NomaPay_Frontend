import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../hooks/useAuth";

type HeaderProps = {
  greeting?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

/**
 * Header de página. El botón de perfil (avatar + nombre en desktop, solo
 * el círculo en mobile) vive siempre acá, del lado derecho — `actions` son
 * botones extra de la página que se muestran a la izquierda de ese botón,
 * no lo reemplazan.
 */
export function Header({ greeting, title, subtitle, actions }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="flex items-start justify-between mb-6">
      <div>
        {greeting && <p className="text-[15px] text-text-light-secondary dark:text-text-dark-secondary mb-0.5">{greeting}</p>}
        <h1 className="title">{title}</h1>
        {subtitle && <p className="subtitle mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}
        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Mi perfil"
          className="flex items-center gap-2 rounded-control py-1 pl-1 pr-1 lg:pr-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <Avatar user={user} size="sm" />
          <span className="hidden lg:inline text-[13.5px] font-medium text-text-light-primary dark:text-text-dark-primary truncate max-w-35">
            {user ? `${user.name} ${user.surname}` : ""}
          </span>
        </button>
      </div>
    </header>
  );
}
