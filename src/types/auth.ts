export type AuthUser = {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  alias: string;
  cbu: string | null;
  country?: string | null;
  profilePictureUrl?: string | null;
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

// Login/Google devuelven tokens + user. Register devuelve solo el user (sin sesión).
export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = AuthUser;

// Solo country y username se aplican de verdad en el backend hoy.
export type UpdateProfilePayload = {
  country?: string;
  alias?: string;
  username?: string; 
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type UpdatePreferredCurrencyPayload = {
  preferredCurrency: string;
};

