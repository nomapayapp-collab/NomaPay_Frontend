import { IconShield, IconEye, IconSmartphone } from "../../assets/icons/Icons";

const TRUST = [
  {
    icon: IconShield,
    color: "text-violet-500",
    title: "Seguridad",
    description: "Protegemos tu cuenta y tus operaciones con tecnología de nivel bancario.",
  },
  {
    icon: IconEye,
    color: "text-turquoise-500",
    title: "Transparencia",
    description:
      "Siempre sabés cuánto enviás, cuánto recibís y qué costos hay. La tasa se fija antes de confirmar.",
  },
  {
    icon: IconSmartphone,
    color: "text-magenta-500",
    title: "Todo en un lugar",
    description:
      "Gestioná tus movimientos, convertí divisas y usá tu dinero desde el celular, sin saltar entre apps.",
  },
];

export function LandingTrust() {
  return (
    <section id="seguridad" className="bg-surface-dark px-6 md:px-12 py-16">
      <p className="text-xs tracking-[0.2em] uppercase text-turquoise-500 font-semibold mb-8 border-b border-white/10 pb-6">
        Tu plata merece tranquilidad
      </p>
      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {TRUST.map(({ icon: Icon, color, title, description }) => (
          <div key={title} className="py-6 md:px-6 first:md:pl-0">
            <Icon className={`w-5 h-5 mb-3 ${color}`} />
            <p className="font-semibold text-text-dark-primary mb-1">{title}</p>
            <p className="text-sm text-text-dark-tertiary">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}