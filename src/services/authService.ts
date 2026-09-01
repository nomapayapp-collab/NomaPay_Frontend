import { api } from "./api";
import type {
  AuthResponse,
  RegisterResponse,
  LoginPayload,
  RegisterPayload,
  AuthUser,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/auth";
import type { WalletSummary } from "../types/wallet";

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/api/auth/register", payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
  return data;
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/google/login", { idToken });
  return data;
}

export async function registerWithGoogle(idToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/google/register", { idToken });
  return data;
}

export async function refreshSession(refreshToken: string) {
  const { data } = await api.post<{ accessToken: string; refreshToken: string }>(
    "/api/auth/refresh",
    { refreshToken }
  );
  return data;
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await api.post("/api/auth/logout", { refreshToken });
}

// export async function resendVerificationCode(email: string): Promise<void> {
//   TODO: no existe todavía del lado del back, confirmar si lo hacemos?.
// }

export async function getMyProfile(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/api/users/me");
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { data } = await api.patch<AuthUser>("/api/users/me", payload);
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.patch("/api/users/me/password", payload);
}

export async function getMyWallet(): Promise<WalletSummary> {
  const { data } = await api.get<WalletSummary>("/api/wallets/me");
  return data;
}

export async function updatePreferredCurrency(preferredCurrency: string) {
  const { data } = await api.patch("/api/wallets/me/preferred-currency", { preferredCurrency });
  return data;
}

