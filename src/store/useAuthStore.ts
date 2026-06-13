import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

/**
 * Zustand global auth store.
 * Holds active authenticated user and token state.
 */
export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setAuth: (user: User, accessToken: string) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isInitializing: false,
    });
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    });
  },

  setInitializing: (isInitializing: boolean) => {
    set({ isInitializing });
  },
}));
