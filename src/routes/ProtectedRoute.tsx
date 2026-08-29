import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * envuelve una página que requiere sesión activa.
 * Mientras se hidrata la sesión (loading) no muestra nada, para evitar el
 * "parpadeo" a /login antes de confirmar si había token guardado. Si ya
 * cargó y no hay usuario, redirige a /login.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // TODO: reemplazar por spinner/skeleton de carga

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}