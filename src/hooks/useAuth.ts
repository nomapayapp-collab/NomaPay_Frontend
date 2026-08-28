import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * useAuth() — así se consume la sesión desde cualquier componente:
 *
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *
 * Tira un error claro si alguien lo usa fuera de <AuthProvider>,
 * en vez de fallar silenciosamente con "undefined".
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
}
