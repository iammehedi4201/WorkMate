import { useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';

/**
 * Custom hook providing access to auth state and action dispatchers.
 */
export const useAuth = () => {
  const { user, accessToken, isAuthenticated, isInitializing, setAuth, clearAuth, setInitializing } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      // Save tokens to SecureStore
      await tokenService.saveTokens(response.tokens.accessToken, response.tokens.refreshToken);
      // Update global Zustand state
      setAuth(response.user, response.tokens.accessToken);
      return response;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }, [setAuth]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await authService.register(email, password, name);
      // Save tokens to SecureStore
      await tokenService.saveTokens(response.tokens.accessToken, response.tokens.refreshToken);
      // Update global Zustand state
      setAuth(response.user, response.tokens.accessToken);
      return response;
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }, [setAuth]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Backend logout warning:', error);
    } finally {
      // Clear tokens and Zustand state regardless of backend response
      await tokenService.clearTokens();
      clearAuth();
    }
  }, [clearAuth]);

  const initializeAuth = useCallback(async () => {
    setInitializing(true);
    try {
      const token = await tokenService.getAccessToken();
      const refreshToken = await tokenService.getRefreshToken();
      
      if (token && refreshToken) {
        // In a real application, you would verify the token with the server
        // or attempt a quick user info fetch to validate.
        // E.g.:
        // const user = await authService.getCurrentUser();
        // setAuth(user, token);

        // For demonstration, let's load a mock user if tokens are found
        const mockUser = {
          id: '12345',
          email: 'user@example.com',
          name: 'Sheehan Rahman',
          avatarUrl: 'https://i.imgur.com/E8eZ80Q.png',
        };
        setAuth(mockUser, token);
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuth();
    } finally {
      setInitializing(false);
    }
  }, [setAuth, clearAuth, setInitializing]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isInitializing,
    login,
    register,
    logout,
    initializeAuth,
  };
};
