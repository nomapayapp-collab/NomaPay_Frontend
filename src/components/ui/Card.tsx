import type { HTMLAttributes } from "react";


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