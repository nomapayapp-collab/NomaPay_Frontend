
const PROBLEMS = [
  {
    number: "01",
    title: "Cobrar desde otro país",
    description:
      "Procesos largos, bancos tradicionales y muchas barreras de entrada.",
  },
  {
    number: "02",
    title: "Comisiones ocultas",
    description:
      "Pagás más de lo que deberías y recibís bastante menos de lo facturado.",
  },
  {
    number: "03",
    title: "Vivís entre varios países",
    description:
      "Necesitás una solución que se mueva a la misma velocidad que vos.",
  },
];

export function LandingProblem() {
  return (
    <section className="bg-surface-dark px-6 md:px-12 py-16">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-magenta font-semibold mb-3">
            El problema
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-text-dark-primary mb-4">
            Trabajar para el mundo no debería complicarte para cobrar.
          </h2>
          <p className="text-sm text-text-dark-secondary max-w-sm">
            Una sola billetera para manejar tu plata mientras el mundo es tu
            oficina.
          </p>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-6 border-b border-white/10 pb-6 mb-6">
            {PROBLEMS.map((p) => (
              <div key={p.number}>
                <p className="text-xs text-brand-magenta font-semibold mb-2">{p.number}</p>
                <p className="font-semibold text-text-dark-primary text-sm mb-1">{p.title}</p>
                <p className="text-xs text-text-dark-tertiary">{p.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-turquoise font-semibold mb-2">
            La solución
          </p>
          <p className="text-sm text-text-dark-secondary max-w-md">
            Lo hacemos simple, claro y sin fronteras. Una cuenta, tres
            monedas, cero sorpresas.
          </p>
        </div>
      </div>

    {/*   <div className="flex justify-center mt-12">
        <Logo variant="lockup-oscuro" className="h-10 w-auto" />
      </div> */}
    </section>
  );
}