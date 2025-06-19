import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth';
import { AuthUser, LoginCredentials, TwoFactorData } from '@/types';
import toast from 'react-hot-toast';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  verify2FA: (data: TwoFactorData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);

  const isAuthenticated = !!user && authService.isAuthenticated();

  /**
   * Initialize auth state
   */
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        if (authService.isAuthenticated()) {
          const isValid = await authService.verifyToken();
          
          if (isValid) {
            const storedUser = authService.getUser();
            if (storedUser) {
              setUser(storedUser);
            }
          } else {
            await authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        if (response.data.requires2FA) {
          setRequires2FA(true);
          return false; // Need 2FA verification
        } else {
          setUser(response.data.user);
          setRequires2FA(false);
          toast.success('Login successful!');
          return true;
        }
      } else {
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 2FA verification function
   */
  const verify2FA = useCallback(async (data: TwoFactorData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authService.verify2FA(data);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setRequires2FA(false);
        toast.success('2FA verification successful!');
        return true;
      } else {
        toast.error(response.message || '2FA verification failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || '2FA verification failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      setRequires2FA(false);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      setUser(null);
      setRequires2FA(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      toast.error('Failed to refresh user data');
    }
  }, [isAuthenticated]);

  return {
    user,
    isAuthenticated,
    isLoading,
    requires2FA,
    login,
    verify2FA,
    logout,
    refreshUser
  };
};