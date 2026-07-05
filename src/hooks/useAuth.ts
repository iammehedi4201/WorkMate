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
      // Save token and user info to SecureStore
      await tokenService.saveTokens(response.tokens.accessToken, response.tokens.refreshToken);
      await tokenService.saveUserInfo(response.user);
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
      // Save token and user info to SecureStore
      await tokenService.saveTokens(response.tokens.accessToken, response.tokens.refreshToken);
      await tokenService.saveUserInfo(response.user);
      // Update global Zustand state
      setAuth(response.user, response.tokens.accessToken);
      return response;
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }, [setAuth]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot Password Error:', error);
      throw error;
    }
  }, []);

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
      const storedUser = await tokenService.getUserInfo();
      
      if (token && storedUser) {
        setAuth(storedUser, token);
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
    forgotPassword,
    logout,
    initializeAuth,
  };
};
