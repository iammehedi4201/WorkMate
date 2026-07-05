import { apiClient } from './apiClient';
import { AuthResponse, User, BackendLoginResponse } from '../types/auth';

/**
 * Authentication API Service.
 * Talks to backend endpoints for authentication.
 */
export const authService = {
  /**
   * Log in user with email and password.
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<BackendLoginResponse>('/public/employeeAuth/login', {
      email,
      password,
    });

    const data = response.data;
    
    return {
      user: {
        id: data._id,
        email: data.email,
        name: data.name,
        nickName: data.nickName,
        dp: data.dp,
        level: data.level,
        designations: data.designations,
        departments: data.departments,
        permissions: data.permissions,
        // Match avatarUrl to dp if needed by parts of frontend
        avatarUrl: data.dp,
      },
      tokens: {
        accessToken: data.token,
        refreshToken: '', // Backend doesn't return a refresh token
      },
    };
  },

  /**
   * Register a new user. (Note: invite-only, requires valid invite token in DB)
   */
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await apiClient.post<BackendLoginResponse>('/public/employeeAuth/register', {
      email,
      password,
      name,
      level: 'employee',
    });

    const data = response.data;

    return {
      user: {
        id: data._id,
        email: data.email,
        name: data.name,
        nickName: data.nickName,
        dp: data.dp,
        level: data.level,
        designations: data.designations,
        departments: data.departments,
        permissions: data.permissions,
        avatarUrl: data.dp,
      },
      tokens: {
        accessToken: data.token,
        refreshToken: '',
      },
    };
  },

  /**
   * Send forgot password recovery email.
   */
  async forgotPassword(email: string): Promise<{ message?: string; _id?: string; email?: string }> {
    const response = await apiClient.post('/public/employeeAuth/forgotEmployeePassword', {
      email,
    });
    return response.data;
  },

  /**
   * Revoke/logout current session.
   */
  async logout(): Promise<void> {
    // Backend doesn't have an active session revocation endpoint for employee JWTs,
    // so we just do a local logout. If needed in future, add apiClient call here.
  },

  /**
   * Fetch details of currently authenticated user.
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
