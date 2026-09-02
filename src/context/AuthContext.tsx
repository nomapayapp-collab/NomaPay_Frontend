import { createContext, useState, useEffect, type ReactNode } from "react";
import * as authService from "../services/authService";
import type { AuthUser, LoginPayload, AuthResponse } from "../types/auth";
import { SPLASH_SEEN_KEY } from "../hooks/useSplash";
/**
 * context/AuthContext.tsx — estado global de sesión.
 * No se usa directo: los componentes consumen esto a través del hook useAuth().
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

const TOKEN_KEY = "nomapay_token";
const USER_KEY = "nomapay_user";
const REFRESH_TOKEN_KEY = "nomapay_refresh_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Al montar la app, si había una sesión guardada, la recuperamos
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // localStorage tenía algo corrupto (ej: "undefined" de una sesión vieja
        // que se cortó a la mitad) — lo limpiamos y arrancamos como si no
        // hubiera sesión, en vez de romper toda la app.
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  function persistSession(response: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    sessionStorage.removeItem(SPLASH_SEEN_KEY);
    setUser(response.user);
  }
  function updateUser(updatedUser: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  }
  async function login(payload: LoginPayload) {
    const response = await authService.login(payload);
    persistSession(response);
  }
  async function loginWithGoogle(idToken: string) {
    const response = await authService.loginWithGoogle(idToken);
    persistSession(response);
  }

  async function registerWithGoogle(idToken: string) {          // <-- nuevo
    const response = await authService.registerWithGoogle(idToken);
    persistSession(response);
  }
  function logout() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      authService.logoutRequest(refreshToken).catch(() => {
        // si falla la revocación del lado del server, igual cerramos sesión local
      });
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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
