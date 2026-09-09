import { createContext, useState, useEffect, type ReactNode } from "react";
import * as authService from "../services/authService";
import type { AuthUser, LoginPayload } from "../types/auth";
import { SPLASH_SEEN_KEY } from "../hooks/useSplash";
import { onSessionExpired } from "../services/authEvents";


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

  useEffect(() => {
    
    return onSessionExpired(() => setUser(null));
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