import { createContext, useState, useEffect, type ReactNode } from "react";
import * as authService from "../services/authService";
import type { AuthUser, LoginPayload } from "../types/auth";
import { SPLASH_SEEN_KEY } from "../hooks/useSplash";
/**
 * context/AuthContext.tsx — estado global de sesión.
 * No se usa directo: los componentes consumen esto a través del hook useAuth().
 *
 * La sesión vive en una cookie httpOnly que pone el backend — el front nunca
 * la toca ni la guarda en ningún lado. Para saber si hay sesión activa al
 * montar la app (o al refrescar la página), le preguntamos al backend con
 * /users/me: si la cookie es válida, contesta 200 con el user; si no, 401.
 */

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  registerWithGoogle: (idToken: string) => Promise<void>;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getMyProfile()
      .then(setUser)
      .catch(() => setUser(null)) // sin cookie válida = sin sesión, no es un error real
      .finally(() => setLoading(false));
  }, []);

  function persistSession(loggedUser: AuthUser) {
    sessionStorage.removeItem(SPLASH_SEEN_KEY);
    setUser(loggedUser);
  }
  function updateUser(updatedUser: AuthUser) {
    setUser(updatedUser);
  }
  async function login(payload: LoginPayload) {
    const loggedUser = await authService.login(payload);
    persistSession(loggedUser);
  }
  async function loginWithGoogle(idToken: string) {
    const loggedUser = await authService.loginWithGoogle(idToken);
    persistSession(loggedUser);
  }
  async function registerWithGoogle(idToken: string) {
    const loggedUser = await authService.registerWithGoogle(idToken);
    persistSession(loggedUser);
  }
  function logout() {
    authService.logoutRequest().catch(() => {
      // si falla la revocación del lado del server, igual cerramos sesión local
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, loginWithGoogle, registerWithGoogle, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}