export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string;
  password: string;
}
