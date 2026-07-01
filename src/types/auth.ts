export interface User {
  id: string
  username: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
}
