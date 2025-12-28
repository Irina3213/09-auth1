export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
