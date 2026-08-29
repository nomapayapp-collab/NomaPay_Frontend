import type { HTMLAttributes } from "react";

/**
 * contenedor base reutilizable (fondo, borde, radio) para toda la app.
 * tarjeta de saldo, cotizaciones, movimientos, etc.
 *
 * Variantes (clases de index.css):
 *   default   → .card. Fondo plano, borde sutil.
 *   elevated  → suma sombra.
 *   aura      → degradado de marca de fondo. Usar con moderación (máx. un
 *               gradiente por pantalla — la propia guía dice que la tarjeta
 *               de saldo es justo uno de los lugares permitidos).
 */
type CardVariant = "default" | "elevated" | "aura";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

const variantClass: Record<CardVariant, string> = {
  default: "",
  elevated: "card--elevated",
  aura: "card--aura",
};

export function Card({ variant = "default", className, children, ...rest }: CardProps) {
  const classes = ["card", variantClass[variant], className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}