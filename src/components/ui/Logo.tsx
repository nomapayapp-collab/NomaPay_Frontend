/*go.tsx— muestra el logo de NomaPay como <img>, sirviendo el archivo .svg
correcto según dónde se use. No hay que convertir nada a JSX: los 5 SVG
reales viven como archivos estáticos en /public/logo/ y este componente
solo elige cuál mostrar.*
Ejemplos:
<Logo variant="lockup-oscuro" className="w-44" />   ← logo completo, fondo oscuro (Login)
<Logo variant="icono" className="w-10 h-10" />       ← solo el símbolo, sin texto
<Logo variant="mono-blanco" className="w-8" />       ← monocromo blanco (ej. sobre foto)
*/

type LogoVariant =
  | "icono"
  | "lockup-claro"
  | "lockup-oscuro"
  | "mono-blanco"
  | "mono-tinta";
 
const FILES: Record<LogoVariant, string> = {
  icono: "/logo/nomapay-icono.svg",
  "lockup-claro": "/logo/nomapay-lockup-claro.svg",
  "lockup-oscuro": "/logo/nomapay-lockup-oscuro.svg",
  "mono-blanco": "/logo/nomapay-mono-blanco.svg",
  "mono-tinta": "/logo/nomapay-mono-tinta.svg",
};
 
type Props = {
  variant: LogoVariant;
  className?: string;
};
 
export function Logo({ variant, className }: Props) {
  return <img src={FILES[variant]} alt="NomaPay" className={className} />;
}