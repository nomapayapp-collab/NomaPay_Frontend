export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  country: string;
  alias: string;

};

export type LoginPayload = {
  email: string;
  password: string;
};
export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};