

type LogoVariant =
  | "icono"
  | "lockup-claro"
  | "lockup-oscuro"
  | "mono-blanco"
  | "mono-tinta"
  | "isologo-blanco";
 
const FILES: Record<LogoVariant, string> = {
  icono: "/logo/nomapay-icono.svg",
  "lockup-claro": "/logo/nomapay-lockup-claro.svg",
  "lockup-oscuro": "/logo/nomapay-lockup-oscuro.svg",
  "mono-blanco": "/logo/nomapay-mono-blanco.svg",
  "mono-tinta": "/logo/nomapay-mono-tinta.svg",
  "isologo-blanco": "/logo/nomapay-isologo-blanco.svg",
};
 
type Props = {
  variant: LogoVariant;
  className?: string;
};
 
export function Logo({ variant, className }: Props) {
  return <img src={FILES[variant]} alt="NomaPay" className={className} />;
}