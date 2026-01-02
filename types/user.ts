export interface User {
  email: string;
  username: string;
  avatar: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  avatar?: string;
  password?: string;
}
