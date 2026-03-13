export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorData {
  email: string;
  code: string;
}

export interface AuthUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'architect';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
  verify2FA: (data: TwoFactorData) => Promise<void>;
  resend2FA: (email: string) => Promise<void>;
}