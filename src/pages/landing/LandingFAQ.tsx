import { useState } from "react";
import { IconChevronRight } from "../../assets/icons/Icons";

const FAQ_LEFT = [
  { q: "¿Qué es NomaPay?", a: "Una billetera digital para cobrar, convertir y usar tu dinero en distintas monedas desde una sola cuenta." },
  { q: "¿En qué países puedo recibir dinero?", a: "Por ahora podés recibir pagos desde Argentina, Brasil y Estados Unidos, con más países en camino." },
  { q: "¿Qué monedas puedo manejar?", a: "ARS, USD y BRL  todas desde la misma cuenta." },
];

const FAQ_RIGHT = [
  {
    q: "¿Cómo se calcula el tipo de cambio?",
    a: "Tomamos la cotización del mercado al momento de la operación y te la mostramos antes de que confirmes. Queda fijada 45 segundos: si la aceptás en ese lapso, es la que se aplica.",
  },
  { q: "¿Cuánto cuesta usar NomaPay?", a: "0,5% de comisión por operación, sin costos ocultos ni letra chica." },
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
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-violet-500 font-semibold mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Lo que todos preguntan.</h2>
        </div>
      {/*   <a href="#" className="hidden md:flex items-center gap-1 text-sm font-medium text-violet-500">
          Ver todas <IconChevronRight className="w-4 h-4" />
        </a> */}
      </div>

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