import { useReveal } from "../../hooks/animations/useReveal";
import { useCountUp } from "../../hooks/animations/useCountUp";

const STATS = [
  { value: "3", label: "divisas en una sola cuenta" },
  { value: "1", label: "billetera para tu dinero" },
  { value: "24/7", label: "acceso desde cualquier lugar" },
  { value: "0", label: "fronteras para acceder a tu cuenta" },
];

function StatValue({ raw, active }: { raw: string; active: boolean }) {
  const numeric = /^\d+$/.test(raw) ? Number(raw) : null;
  const count = useCountUp(numeric ?? 0, active && numeric !== null);
  return <>{numeric !== null ? count : raw}</>;
}

export function LandingStats() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-t border-white/10 px-6 md:px-12 py-8"
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className="px-4 first:pl-0 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: isVisible ? `${i * 100}ms` : "0ms",
          }}
        >
          <p className="text-2xl font-extrabold text-text-dark-primary tabular">
            <StatValue raw={s.value} active={isVisible} />
          </p>
          <p className="text-xs text-text-dark-tertiary mt-1">{s.label}</p>
        </div>
      ))}
    </section>
  );
}