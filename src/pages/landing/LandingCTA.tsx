import { Link } from "react-router-dom";

export function LandingCTA() {
  return (
    <section
      className="px-6 md:px-12 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
      style={{ backgroundImage: "var(--gradient-swoosh)" }}
    >
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-white mb-3">
          Tu trabajo no tiene fronteras.
          <br />
          Tu plata tampoco.
        </h2>
        <p className="text-sm text-white/80 max-w-md">
          Empezá a usar NomaPay hoy. Sin costos de apertura y sin letras chicas.
        </p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <Link to="/register" className="btn bg-ink text-white hover:opacity-90">
          Crear mi cuenta gratis
        </Link>
        <p className="text-xs text-white/70">Creá tu cuenta gratis y ya podés recibir cobros.</p>
      </div>
    </section>
  );
}