import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconUser } from "../../assets/icons/Icons";

type HeaderProps = {
  greeting?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function Header({ greeting, title, subtitle, actions }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-start justify-between mb-6">
      <div>
        {greeting && <p className="text-[15px] text-text-dark-secondary mb-0.5">{greeting}</p>}
        <h1 className="title">{title}</h1>
        {subtitle && <p className="subtitle mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {actions ?? (
          <>
            <button
              type="button"
              className="icon-btn"
              aria-label="Mi perfil"
              onClick={() => navigate("/profile")}
            >
              <IconUser className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}