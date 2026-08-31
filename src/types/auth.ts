import type { CurrencyCode } from "./wallet";

export type AuthUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  country: string;
  alias: string;
  cbu: string;
  preferredCurrency: CurrencyCode;
  profileCompleted: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  surname: string;
  country: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type CompleteProfilePayload = {
  name: string;
  surname: string;
  alias: string;
  preferredCurrency: CurrencyCode;
  password?: string; // opcional: solo se manda si se quiere cambiar
};