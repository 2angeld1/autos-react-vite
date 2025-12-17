import { api } from './api';
import { ACCESS_TOKEN_KEY } from '@/utils/constants';
import { setToStorage, removeFromStorage, getFromStorage } from '@/utils/helpers';
import toast from 'react-hot-toast';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
}

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    try {
      console.log('🔐 Attempting login with:', { email: credentials.email });
      
      const response = await api.post<{
        success: boolean;
        data?: LoginResponse;
        token?: string;
        user?: AuthUser;
        message?: string;
      }>('/auth/login', credentials);
      
      console.log('📡 Login response:', response.data);

      if (response.data.success) {
        // Handle different response formats
        const token = response.data.token || response.data.data?.token;
        const user = response.data.user || response.data.data?.user;
        
        if (token && user) {
          this.setAuthData(token, user);
          return { user, token };
        }
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      const message = error.response?.data?.message || 
                     error.message || 
                     'Login failed. Please try again.';
      
      throw new Error(message);
    }
  }

  /**
   * Verify two-factor authentication code
   */
  async verifyTwoFactor(data: { email: string; code: string }): Promise<{ user: AuthUser; token: string }> {
    try {
      const response = await api.post('/auth/verify-2fa', data);
      if (response.data.success) {
        const { user, token } = response.data.data;
        this.setAuthData(token, user);
        return { user, token };
      }
      throw new Error(response.data.message || 'Invalid 2FA code');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '2FA verification failed');
    }
  }

  /**
   * Resend two-factor authentication code
   */
  async resendTwoFactorCode(email: string): Promise<void> {
    try {
      await api.post('/auth/resend-2fa', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend 2FA code');
    }
  }

  /**
   * Update profile
   */
  async updateProfile(data: any): Promise<AuthUser> {
    try {
      const response = await api.put<{
        success: boolean;
        data?: AuthUser;
        user?: AuthUser;
      }>('/auth/profile', data);

      if (response.data.success) {
        const user = response.data.data || response.data.user!;
        if (user) {
          setToStorage('user', user);
        }
        return user;
      }

      throw new Error('Failed to update profile');
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthUser> {
    try {
      const response = await api.get<{
        success: boolean;
        data?: AuthUser;
        user?: AuthUser;
      }>('/auth/profile');
      
      if (response.data.success) {
        return response.data.data || response.data.user!;
      }
      
      throw new Error('Failed to get profile');
    } catch (error: any) {
      console.error('❌ Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    removeFromStorage(ACCESS_TOKEN_KEY);
    removeFromStorage('user');
    toast.success('Logged out successfully');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = getFromStorage(ACCESS_TOKEN_KEY, null);
    const user = getFromStorage('user', null);
    return !!(token && user);
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return getFromStorage(ACCESS_TOKEN_KEY, null);
  }

  /**
   * Get stored user data
   */
  getUser(): AuthUser | null {
    return getFromStorage('user', null);
  }

  /**
   * Store authentication data
   */
  private setAuthData(token: string, user: AuthUser): void {
    setToStorage(ACCESS_TOKEN_KEY, token);
    setToStorage('user', user);
  }

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) return false;
      
      await this.getProfile();
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  async verify2FA(_data: { code: string }): Promise<{ user: AuthUser; token: string }> {
    // Placeholder for 2FA verification
    throw new Error('2FA not implemented');
  }
}

export const authService = new AuthService();