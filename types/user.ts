export interface User {
  email: string;
  username: string;
  avatar: string;
}

export interface RegisterCredentials {
  username: string;
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
