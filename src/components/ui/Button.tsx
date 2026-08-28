import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

/**
 * Button — el único botón que debería existir en toda la app.
 *
 * Variantes (según Identidad_Visual y el sistema de clases en index.css):
 *   primary      → degradado swoosh (violeta→turquesa). Acción principal de la pantalla.
 *   secondary    → degradado PAY (azul-violeta→rosa). Envíos / progreso.
 *   outline      → borde, fondo transparente. Acción secundaria.
 *   ghost        → sin fondo ni borde, solo texto. Acciones terciarias (ej. "Historial").
 *   destructive  → rojo sólido. SOLO acciones irreversibles.
 *
 * Tamaños: "md" (default) | "sm"
 *
 * Modo botón vs. modo link:
 *   <Button onClick={...}>Continuar</Button>          → renderiza <button>
 *   <Button to="/register">Registrate</Button>         → renderiza <Link> de react-router
 *
 * Ejemplos:
 *   <Button variant="primary" fullWidth>Continuar</Button>
 *   <Button variant="outline" size="sm">Cancelar</Button>
 *   <Button variant="ghost" to="/historial">Ver todos</Button>
 *   <Button variant="primary" iconOnly aria-label="Buscar"><IconSearch className="w-5 h-5" /></Button>
 */

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  outline: "btn--outline",
  ghost: "btn--ghost",
  destructive: "btn--destructive",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconOnly?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<LinkProps, "className"> & {
    to: LinkProps["to"];
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

function buildClassName({
  variant = "primary",
  size = "md",
  fullWidth,
  iconOnly,
  className,
}: Pick<CommonProps, "variant" | "size" | "fullWidth" | "iconOnly" | "className">) {
  return [
    "btn",
    variantClass[variant],
    size === "sm" && "btn--sm",
    iconOnly && "btn--icon-only",
    fullWidth && "w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  const { variant, size, fullWidth, iconOnly, loading, children, className, ...rest } = props;
  const classes = buildClassName({ variant, size, fullWidth, iconOnly, className });

  // Modo link: si viene "to", es un <Link> de react-router
  if ("to" in props && props.to !== undefined) {
    const linkRest = rest as Omit<LinkProps, "className">;
    return (
      <Link className={classes} {...linkRest}>
        {loading ? "…" : children}
      </Link>
    );
  }

  // Modo botón normal
  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} disabled={loading || buttonRest.disabled} {...buttonRest}>
      {loading ? "…" : children}
    </button>
  );
}
