export type AuthUser = {
  id: string;
  name: string;
  email: string;
  country: string;
  alias: string;
<<<<<<< HEAD
  profileCompleted: boolean;
=======
>>>>>>> develop
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