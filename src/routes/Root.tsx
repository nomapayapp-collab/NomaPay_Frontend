import Landing from "../pages/landing/Landing";
import Dashboard from "../pages/dashboard/Dashboard";
import Splash from "../pages/Splash";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "../hooks/useAuth";
import { useSplash } from "../hooks/useSplash";

export function Root() {
  const { isAuthenticated, loading } = useAuth();
  const showSplash = useSplash(2000);

  if (loading) return null;
  if (!isAuthenticated) return <Landing />;
  if (showSplash) return <Splash />;

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}