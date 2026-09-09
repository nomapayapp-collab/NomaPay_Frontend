import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";



type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructiveOutline";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  outline: "btn--outline",
  ghost: "btn--ghost",
  destructiveOutline: "btn--destructive-outline",
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
