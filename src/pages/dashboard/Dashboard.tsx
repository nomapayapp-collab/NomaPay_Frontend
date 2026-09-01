import { useNavigate } from "react-router-dom";
import { Header } from "../../components/layout/Header";
import { BottomTabBar } from "../../components/layout/BottomTabBar";
import { Sidebar } from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/Button";
import { IconUser } from "../../assets/icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { BalanceCard } from "../../components/wallet/BalanceCard";
import { QuickActions } from "./QuickActions";
import { ExchangeRatesList } from "../../components/wallet/ExchangeRatesList";
import { RecentMovements } from "../../components/wallet/RecentMovements";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface-dark">
      <Sidebar />

      <div className="flex-1 px-5 pt-8 pb-4 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
        <Header
          greeting={`Hola, ${firstName} 👋`}
          title="Tu ruta financiera"
          actions={
            <div className="flex items-center gap-3">
              {/* TODO(desktop): barra de búsqueda del mockup ("Buscar movimiento,
                  alias o comprobante") — no hay endpoint de búsqueda todavía, ni
                  tiene mucho sentido simularla con datos mockeados. Va acá cuando
                  haya algo real para buscar:
              <div className="hidden lg:block relative w-72">
                <IconSearch className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-tertiary" />
                <input type="text" placeholder="Buscar movimiento, alias o comprobante" className="input pl-11" />
              </div>
              */}
              <Button variant="primary" onClick={() => navigate("/transfer")} className="hidden lg:inline-flex">
                Transferir
              </Button>
              <button
                type="button"
                className="icon-btn lg:hidden"
                aria-label="Mi perfil"
                onClick={() => navigate("/profile")}
              >
                <IconUser className="w-5 h-5" />
              </button>
            </div>
          }
        />

        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
          <div className="lg:col-span-2 flex flex-col gap-5 lg:gap-6">
            <BalanceCard />
            <QuickActions />
            {/* En mobile "Cotizaciones" va acá, entre accesos rápidos y movimientos
                (como siempre). En desktop se pasa a la columna derecha — por eso
                está oculta arriba de lg y repetida más abajo. */}
            <div className="lg:hidden">
              <ExchangeRatesList />
            </div>
            <RecentMovements />
          </div>

          <div className="hidden lg:flex lg:flex-col lg:gap-6">
            <ExchangeRatesList />

            {/* TODO(desktop): gráfico "Esta semana" (entradas/salidas/cambios por
                día). Necesita un endpoint que agregue movimientos por semana — no
                existe todavía. Cuando esté, va una <Card> acá con un bar chart. */}

            {/* TODO(desktop): widget "Asistente NomaPay" (chat). No hay integración
                de IA en el backend todavía. Cuando la haya, va acá. */}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <BottomTabBar />
      </div>
    </div>
  );
}