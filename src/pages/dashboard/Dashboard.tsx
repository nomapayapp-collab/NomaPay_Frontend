import { Header } from "../../components/layout/Header";
import { BottomTabBar } from "../../components/layout/BottomTabBar";
import { useAuth } from "../../hooks/useAuth";
import { BalanceCard } from "../../components/wallet/BalanceCard";
import { QuickActions } from "./QuickActions";
import { ExchangeRatesList } from "../../components/wallet/ExchangeRatesList";
import { RecentMovements } from "../../components/wallet/RecentMovements";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-surface-dark">
      <div className="flex-1 px-5 pt-8 pb-4 max-w-md w-full mx-auto">
        <Header greeting={`Hola, ${firstName} 👋`} title="Tu ruta financiera" />

        <div className="flex flex-col gap-5">
          <BalanceCard />
          <QuickActions />
          <ExchangeRatesList />
          <RecentMovements />
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}