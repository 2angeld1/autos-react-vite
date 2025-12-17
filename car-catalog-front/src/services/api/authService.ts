import { backendApi } from './backendApi';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await backendApi.post<{
      success: boolean;
      data: LoginResponse;
      message?: string;
    }>('/auth/login', credentials);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      this.setAuthData(token, user);
      return { user, token };
    }
    throw new Error(response.data.message || 'Login failed');
  }

  async register(userData: any): Promise<LoginResponse> {
    const response = await backendApi.post<{
      success: boolean;
      data: LoginResponse;
      message?: string;
    }>('/auth/register', userData);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      this.setAuthData(token, user);
      return { user, token };
    }
    throw new Error(response.data.message || 'Registration failed');
  }

  async getProfile(): Promise<AuthUser> {
    const response = await backendApi.get<{
      success: boolean;
      data: AuthUser;
    }>('/auth/profile');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to get profile');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private setAuthData(token: string, user: AuthUser): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export const authService = new AuthService();