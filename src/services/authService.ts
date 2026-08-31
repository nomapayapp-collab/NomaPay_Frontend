import { api } from "./api";

import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  CompleteProfilePayload,
} from "../types/auth";

export async function login(
  payload: LoginPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/api/auth/login",
    payload
  );

  return data;
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/api/auth/register",
    payload
  );

  return data;
}

export async function resendVerificationCode(
  email: string
): Promise<void> {
  await api.post("/api/auth/resend-code", { email });
}

export async function loginWithGoogle(
  idToken: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/api/auth/google",
    { idToken }
  );

  return data;
}

export async function completeProfile(
  payload: CompleteProfilePayload
): Promise<AuthUser> {
  // TODO: confirmar con Gastón/Gisella el path y método exacto.
  // Asumo PATCH /api/users/me devolviendo el AuthUser actualizado.
  const { data } = await api.patch<AuthUser>("/api/users/me", payload);
  return data;
}