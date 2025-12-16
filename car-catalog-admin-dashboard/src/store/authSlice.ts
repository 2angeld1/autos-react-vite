import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService, AuthUser } from '@/services/auth';
import toast from 'react-hot-toast';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  requires2FA: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        requires2FA: false,

        login: async (email: string, password: string) => {
          set({ loading: true, error: null });
          
          try {
            console.log('🔐 Store: Starting login process...');
            
            const { user } = await authService.login({ email, password });
            
            console.log('✅ Store: Login successful', { user });
            
            set({
              user,
              isAuthenticated: true,
              loading: false,
              error: null,
              requires2FA: false
            });
            
          } catch (error: any) {
            console.error('❌ Store: Login failed', error);
            
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: error.message,
              requires2FA: false
            });
            
            throw error;
          }
        },

        logout: () => {
          authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            requires2FA: false
          });
        },

        checkAuth: async () => {
          const isValid = await authService.verifyToken();
          
          if (isValid) {
            const user = authService.getUser();
            set({
              user,
              isAuthenticated: true
            });
          } else {
            set({
              user: null,
              isAuthenticated: false
            });
          }
        },

        initializeAuth: async () => {
          set({ loading: true });
          
          try {
            if (authService.isAuthenticated()) {
              const user = authService.getUser();
              const isValid = await authService.verifyToken();
              
              if (isValid && user) {
                set({
                  user,
                  isAuthenticated: true,
                  loading: false
                });
              } else {
                set({
                  user: null,
                  isAuthenticated: false,
                  loading: false
                });
              }
            } else {
              set({
                user: null,
                isAuthenticated: false,
                loading: false
              });
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            set({
              user: null,
              isAuthenticated: false,
              loading: false
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        reset: () => {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            requires2FA: false
          });
        },
        
        updateProfile: async (data: any) => {
          set({ loading: true, error: null });
          try {
            const user = await authService.updateProfile(data);
            set({ user, loading: false });
            toast.success('Profile updated successfully');
          } catch (error: any) {
            set({ loading: false, error: error.message });
            toast.error(error.message || 'Failed to update profile');
            throw error;
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);