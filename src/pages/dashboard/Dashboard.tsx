import { Header } from "../../components/layout/Header";
import { useAuth } from "../../hooks/useAuth";
import { BalanceCard } from "../../components/wallet/BalanceCard";
import { QuickActions } from "./QuickActions";
import { ExchangeRatesList } from "../../components/wallet/ExchangeRatesList";
import { RecentMovements } from "../../components/wallet/RecentMovements";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <div className="px-5 pt-8 pb-4 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
      <Header
        greeting={`Hola, ${firstName} 👋`}
        title="Tu ruta financiera"
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