import { Navigate } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import Dashboard from "../pages/dashboard/Dashboard";
import Splash from "../pages/Splash";
import { useAuth } from "../hooks/useAuth";
import { useSplash } from "../hooks/useSplash";

export function Root() {
  const { isAuthenticated, loading, user } = useAuth();
  const showSplash = useSplash(2000);

  if (loading) return null;
  if (!isAuthenticated) return <Landing />;
  if (!user?.profileCompleted) return <Navigate to="/profile" replace />;
  return showSplash ? <Splash /> : <Dashboard />;
}