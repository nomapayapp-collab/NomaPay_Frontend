import { useNavigate } from "react-router-dom";
import { Header } from "../../components/layout/Header";
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
    <div className="px-5 pt-8 pb-4 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
      <Header
        greeting={`Hola, ${firstName} 👋`}
        title="Tu ruta financiera"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={() => navigate("/transfer")} className="hidden lg:inline-flex">
              Transferir
            </Button>
            <button
              type="button"
              className="icon-btn lg:hidden"
              aria-label="Mi perfil"
              onClick={() => navigate("/profile")}
            >
              <IconUser className="w-5 h-5 "  />
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
        <div className="lg:col-span-2 flex flex-col gap-5 lg:gap-6">
          <BalanceCard />
          <QuickActions />
          <div className="lg:hidden">
            <ExchangeRatesList />
          </div>
          <RecentMovements />
        </div>

        <div className="hidden lg:flex lg:flex-col lg:gap-6">
          <ExchangeRatesList />
        </div>
      </div>
    </div>
  );
}