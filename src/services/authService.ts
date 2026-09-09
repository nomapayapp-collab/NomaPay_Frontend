import type {
  AuthResponse,
  RegisterResponse,
  LoginPayload,
  RegisterPayload,
  AuthUser,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/auth";
import type { CurrencyCode, DepositResult, WalletSummary } from "../types/wallet";

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);
  return data;
}
export async function login(payload: LoginPayload): Promise<AuthResponse> {
   const { data } = await api.post<AuthResponse>("/auth/login", payload);
   return data;
 }

 export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
   const { data } = await api.post<AuthResponse>("/auth/google/login", { idToken });
   return data;
 }

 export async function registerWithGoogle(idToken: string): Promise<AuthResponse> {
   const { data } = await api.post<AuthResponse>("/auth/google/register", { idToken });
   return data;
 }


export async function refreshSession() {
  const { data } = await api.post<{ message: string }>("/auth/refresh");
  return data;
}

export async function logoutRequest(): Promise<void> {
  await api.post("/auth/logout");
}

// export async function resendVerificationCode(email: string): Promise<void> {
//   TODO: no existe todavía del lado del back, confirmar si lo hacemos?.
// }

export async function getMyProfile(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/users/me");
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { data } = await api.patch<AuthUser>("/users/me", payload);
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.patch("/users/me/password", payload);
}

export async function updateTheme(theme: "light" | "dark"): Promise<AuthUser> {
  const { data } = await api.patch<AuthUser>("/users/me/theme", { theme });
  return data;
}

export async function getMyWallet(): Promise<WalletSummary> {
  const { data } = await api.get<WalletSummary>("/wallets/me");
  return data;
}

export async function updatePreferredCurrency(preferredCurrency: CurrencyCode): Promise<WalletSummary> {
  const { data } = await api.patch<WalletSummary>("/wallets/me/preferred-currency", { preferredCurrency });
  return data;
}


export async function depositFunds(currencyCode: CurrencyCode, amount: number): Promise<DepositResult> {
  const { data } = await api.post<DepositResult>("/wallets/deposit", { currencyCode, amount });
  return data;
}


export async function forgotPassword(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await api.post("/auth/reset-password", { token, newPassword });
}

import { api } from "./api";

type DeleteAccountResponse = {
  message: string;
};

export async function deleteMyAccount(): Promise<string> {
  const { data } =
    await api.delete<DeleteAccountResponse>(
      "/users/me",
    );

  return data.message;
}