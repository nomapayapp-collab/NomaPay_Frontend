import { useState } from "react";
import { IconChevronRight } from "../../assets/icons/Icons";
import { Reveal } from "../../components/ui/Reveal";

const FAQ_LEFT = [
  {
    q: "¿Qué es NomaPay?",
    a: "NomaPay es una billetera digital pensada para personas que trabajan y se mueven por el mundo. Te permite tener ARS, USD y BRL en una misma cuenta, cambiar entre estas divisas y gestionar tu dinero estés donde estés.",
  },

  {
    q: "¿Qué divisas puedo tener en NomaPay?",
    a: "Actualmente podés manejar tres divisas: pesos argentinos (ARS), dólares estadounidenses (USD) y reales brasileños (BRL). Podés mantener saldo en cualquiera de ellas y cambiar entre las tres desde tu cuenta.",
  },

  {
    q: "¿Puedo usar NomaPay desde cualquier país?",
    a: "Sí. Podés acceder a tu cuenta y gestionar tu dinero estés donde estés. Las operaciones y pagos disponibles actualmente se realizan en ARS, USD y BRL.",
  },

  {
    q: "¿Puedo cambiar una divisa por otra?",
    a: "Sí. Podés convertir tu saldo entre ARS, USD y BRL desde tu cuenta, viendo el tipo de cambio antes de confirmar la operación.",
  },
];

const FAQ_RIGHT = [
  {
    q: "¿Puedo pagar con mi saldo en cualquier parte del mundo?",
    a: "Podés utilizar tu dinero desde cualquier lugar del mundo, siempre que la operación esté disponible y se realice en ARS, USD o BRL.",
  },
  {
    q: "¿Cómo se calcula el tipo de cambio?",
    a: "Tomamos la cotización del mercado al momento de la operación y te la mostramos antes de que confirmes. Queda fijada 45 segundos: si la aceptás en ese lapso, es la que se aplica.",
  },
  { q: "¿Cuánto cuesta usar NomaPay?", a: "0,5% de comisión por operación de cambio, sin costos ocultos ni letra chica." },
  { q: "¿Es seguro usar NomaPay?", a: "Sí, protegemos tu cuenta y tus operaciones con tecnología de nivel bancario." },
];

function FaqItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border-light py-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left text-sm font-medium text-text-light-primary"
      >
        {q}
        <IconChevronRight
          className={`w-4 h-4 text-text-light-tertiary shrink-0 transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`}
        />
      </button>
      {isOpen && <p className="text-sm text-text-light-secondary mt-3">{a}</p>}
    </div>
  );
}

export function LandingFAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    "¿Cómo se calcula el tipo de cambio?"
  );

  const toggle = (q: string) => setOpenQuestion(openQuestion === q ? null : q);

  return (
    <section id="preguntas" className="px-6 md:px-12 py-16 bg-surface-light text-text-light-primary">
      <Reveal className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-violet-500 font-semibold mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Lo que todos preguntan.</h2>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-x-10">
        <div>
          {FAQ_LEFT.map((item) => (
            <FaqItem key={item.q} {...item} isOpen={openQuestion === item.q} onToggle={() => toggle(item.q)} />
          ))}
        </div>
        <div>
          {FAQ_RIGHT.map((item) => (
            <FaqItem key={item.q} {...item} isOpen={openQuestion === item.q} onToggle={() => toggle(item.q)} />
          ))}
        </div>
      </div>
    </section>
  );
}