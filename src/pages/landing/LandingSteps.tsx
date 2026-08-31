import { Reveal } from "../../components/ui/Reveal";

const STEPS = [
  { number: "01", title: "Creá tu cuenta", description: "Registrate gratis en minutos y empezá a disfrutar.", caption: "< 4 minutos" },
  { number: "02", title: "Cobrá global", description: "Compartí tu alias y recibí pagos de clientes o empresas de otros países, en la divisa en que te pagan.", caption: "Acreditación inmediata" },
  { number: "03", title: "Usá tu plata", description: "Convertí, transferí o gastá tu dinero desde un solo lugar, con la tasa a la vista antes de confirmar.", caption: "Al instante" },
];

export function LandingSteps() {
  return (
    <section id="como-funciona" className="px-6 md:px-12 py-16 bg-surface-light text-text-light-primary">
      <Reveal>
        <p className="text-xs tracking-[0.2em] uppercase text-violet-500 font-semibold mb-3">
          Cómo trabajamos
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-10 max-w-lg">
          Tres pasos y ya estás cobrando.
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-8">
        {STEPS.map((s, i) => (
          <Reveal key={s.number} delay={i * 100}>
            <p className="text-sm font-bold text-violet-500 border-t-2 border-violet-500 pt-3 mb-3">
              {s.number}
            </p>
            <p className="font-semibold mb-2">{s.title}</p>
            <p className="text-sm text-text-light-secondary mb-3">{s.description}</p>
            <p className="text-xs text-text-light-tertiary">{s.caption}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}