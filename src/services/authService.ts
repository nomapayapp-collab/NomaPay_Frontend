import { api } from "./api";
import type {
  AuthResponse,
  LoginPayload,
  
} from "../types/auth";

/**
 * services/authService.ts — todas las llamadas a la API relacionadas a sesión.
 * Los componentes NUNCA llaman a "api" directo para esto, siempre pasan por acá.
 *
 * Ajustar los paths ("/auth/login", etc.) cuando el equipo de backend
 * confirme las rutas reales.
 */

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}




export async function resendVerificationCode(email: string): Promise<void> {
  await api.post("/auth/resend-code", { email });
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/google", { idToken });
  return data;
}
