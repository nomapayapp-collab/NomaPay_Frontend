
/**
 * Icons.tsx — todos los íconos de UI de NomaPay como componentes de React.
 *
 * Uso:
 *   import { IconHome, IconWallet, IconSend } from "@/components/icons/Icons";
 *   <IconHome className="w-5 h-5 text-violet-500" />
 *
 * Todos son stroke-based (viewBox 0 0 24 24, currentColor), así que heredan
 * el color de texto del elemento padre — no hace falta pasar "color", solo
 * className con un text-* de Tailwind.
 *
 * Excepción: IconStar es fill-based (relleno), como corresponde a un ícono
 * de "favorito" que se ve mejor sólido.
 */
import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* -------------------- Navegación -------------------- */

export function IconHome(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9.7 12 3l9 6.7V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9.5 21v-8h5v8" />
    </svg>
  );
}

export function IconWallet(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M3 8l2-4h14l2 4" />
      <path d="M15.5 14h2.5" />
    </svg>
  );
}

export function IconSwap(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m17 3 4 4-4 4" />
      <path d="M3 11V9a2 2 0 0 1 2-2h16" />
      <path d="m7 21-4-4 4-4" />
      <path d="M21 13v2a2 2 0 0 1-2 2H3" />
    </svg>
  );
}

export function IconUpDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 15 3.5 3.5L11 15" />
      <path d="M7.5 18.5V5.5" />
      <path d="m20 9-3.5-3.5L13 9" />
      <path d="M16.5 5.5v13" />
    </svg>
  );
}

export function IconSend(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function IconPaper(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m21 3-8 18-3.2-6.8L3 11z" />
      <path d="M21 3 9.8 14.2" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </svg>
  );
}

export function IconTrend(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 7.5 13.5 15l-4-4L3 17.5" />
      <path d="M15.5 7.5H21V13" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 10.5c0 5.8-8 11.5-8 11.5S4 16.3 4 10.5a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.3" r="2.6" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

/* -------------------- Cuenta / seguridad -------------------- */

export function IconLock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4l16 16" />
      <path d="M9.5 6c.8-.2 1.6-.3 2.5-.3 6.4 0 10 6.3 10 6.3s-1 1.8-2.8 3.4" />
      <path d="M6.3 8.1C3.6 9.9 2 12 2 12s3.6 6.5 10 6.5c1.6 0 3-.4 4.2-.9" />
      <path d="M10.2 10.3a2.6 2.6 0 0 0 3.6 3.6" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7.5 3v5.5c0 5-3.2 8.4-7.5 10-4.3-1.6-7.5-5-7.5-10V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
    </svg>
  );
}

export function IconQr(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8" />
      <path d="M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8" />
      <path d="M21 16v2.5A2.5 2.5 0 0 1 18.5 21H16" />
      <path d="M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16" />
      <path d="M7 12h10" />
    </svg>
  );
}

/* -------------------- Feedback / estado -------------------- */

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2.4} {...props}>
      <path d="M20 6.5 9.2 17.3 4 12.1" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2.4} {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9" />
      <path d="M10.2 21a2 2 0 0 0 3.6 0" />
    </svg>
  );
}

/* -------------------- Favorito (relleno, no stroke) -------------------- */

export function IconStar(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="m12 3.5 2.7 5.6 6.1.9-4.4 4.3 1 6.2-5.4-2.9-5.4 2.9 1-6.2L3.2 10l6.1-.9z" />
    </svg>
  );
}

/* -------------------- Navegación / acciones genéricas -------------------- */

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function IconBack(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.9} {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5.5" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M12 5.5v13" />
      <path d="M5.5 12h13" />
    </svg>
  );
}