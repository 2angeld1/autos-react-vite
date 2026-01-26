import { create } from 'zustand';
import { authService, type AuthUser } from '../services/api/authService';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  initialize: () => {
    const user = authService.getUser();
    const isAuth = authService.isAuthenticated();
    if (user && isAuth) {
      set({ user, isAuthenticated: true });
    }
  },

  login: (token, user) => {
    authService['setAuthData'](token, user); // We need to access private method or just rely on API response handling it? 
    // Actually authService.login already sets localStorage in the service class impl I saw. 
    // Wait, authService.login called 'this.setAuthData' internally.
    // So the store just needs to update React state.
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  }
}));
