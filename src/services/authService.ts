import { apiClient } from './apiClient';
import { AuthResponse, User } from '../types/auth';

/**
 * Authentication API Service.
 * Talks to backend endpoints for authentication.
 */
export const authService = {
  /**
   * Log in user with email and password.
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // For a real production app, you would make this call:
    // const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    // return response.data;

    // For boilerplate mock demonstration:
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
    
    if (password === 'password123') {
      return {
        user: {
          id: '12345',
          email,
          name: 'John Doe',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        },
        tokens: {
          accessToken: 'mock-access-token-jwt-value',
          refreshToken: 'mock-refresh-token-jwt-value',
        },
      };
    } else {
      throw new Error('Invalid email or password. Use password: password123');
    }
  },

  /**
   * Register a new user.
   */
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    // For production:
    // const response = await apiClient.post<AuthResponse>('/auth/register', { email, password, name });
    // return response.data;

    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      user: {
        id: '12345',
        email,
        name,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      },
      tokens: {
        accessToken: 'mock-access-token-jwt-value',
        refreshToken: 'mock-refresh-token-jwt-value',
      },
    };
  },

  /**
   * Revoke/logout current session.
   */
  async logout(): Promise<void> {
    try {
      // For production:
      // await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed', error);
    }
  },

  /**
   * Refresh current access token using the refresh token.
   */
  async refreshToken(_refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    // For production, the apiClient interceptor makes this request:
    // const response = await apiClient.post('/auth/refresh', { refreshToken });
    // return response.data;

    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      accessToken: 'new-mock-access-token-jwt-value',
      refreshToken: 'new-mock-refresh-token-jwt-value',
      user: {
        id: '12345',
        email: 'user@example.com',
        name: 'John Doe',
      },
    };
  },

  /**
   * Fetch details of currently authenticated user.
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
