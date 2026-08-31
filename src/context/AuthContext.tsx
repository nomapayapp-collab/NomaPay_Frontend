import { createContext, useState, useEffect, type ReactNode } from "react";
import * as authService from "../services/authService";
import type { AuthUser, LoginPayload, AuthResponse } from "../types/auth";

/**
 * context/AuthContext.tsx — estado global de sesión.
 * No se usa directo: los componentes consumen esto a través del hook useAuth().
 */

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean; // true mientras se hidrata la sesión al cargar la app
  login: (payload: LoginPayload) => Promise<void>;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "nomapay_token";
const USER_KEY = "nomapay_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Al montar la app, si había una sesión guardada, la recuperamos
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function persistSession(response: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
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


  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
