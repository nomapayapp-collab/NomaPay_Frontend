const STATS = [
  { value: "3", label: "países desde los que podés cobrar" },
  { value: "0,5%", label: "de comisión, sin letra chica" },
  { value: "0,01 Seg", label: "para tener la plata disponible" },
  { value: "3", label: "divisas en una sola cuenta" },
];

export function LandingStats() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-t border-white/10 px-6 md:px-12 py-8">
      {STATS.map((s) => (
        <div key={s.label} className="px-4 first:pl-0">
          <p className="text-2xl font-extrabold text-text-dark-primary tabular">{s.value}</p>
          <p className="text-xs text-text-dark-tertiary mt-1">{s.label}</p>
        </div>
      ))}
    </section>
  );
}