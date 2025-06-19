export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorData {
  email: string;
  code: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
}