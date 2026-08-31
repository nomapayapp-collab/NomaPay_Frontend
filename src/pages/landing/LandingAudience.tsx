import { IconMessage, IconGlobe, IconBriefcase } from "../../assets/icons/Icons";
import { Reveal } from "../../components/ui/Reveal";

const AUDIENCE = [
  { icon: IconMessage, color: "text-violet-500", title: "Freelancers",
    description: "Cobrá tus proyectos de clientes de cualquier parte del mundo, sin abrir una cuenta afuera." },
  { icon: IconGlobe, color: "text-turquoise-700", title: "Nómades digitales",
    description: "Viajá y mantené tu dinero a mano, en la divisa del país donde estés parado hoy." },
  { icon: IconBriefcase, color: "text-magenta-500", title: "Remote workers",
    description: "Recibí tu sueldo de una empresa internacional y gestioná todo desde un solo lugar." },
];

export function LandingAudience() {
  return (
    <section id="para-quien-es" className="px-6 md:px-12 py-16 bg-surface-light text-text-light-primary">
      <Reveal>
        <div className="grid md:grid-cols-2 gap-8 items-end mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-violet-500 font-semibold mb-3">
              Para quién es
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Hecha para quienes trabajan sin fronteras.
            </h2>
          </div>
          <p className="text-sm text-text-light-secondary max-w-md">
            Si tu cliente está en otro país y tu vida está acá, el problema
            nunca fue el trabajo: fue cobrarlo. NomaPay resuelve la parte
            aburrida para que vos sigas con la tuya.
          </p>
        </div>
      </Reveal>

      <div className="border-t border-border-light grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-light">
        {AUDIENCE.map(({ icon: Icon, color, title, description }, i) => (
          <Reveal key={title} delay={i * 100} className="py-6 md:px-6 first:md:pl-0 transition-transform duration-200 hover:-translate-y-1">
            <Icon className={`w-5 h-5 mb-3 ${color}`} />
            <p className="font-semibold mb-1">{title}</p>
            <p className="text-sm text-text-light-secondary">{description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}