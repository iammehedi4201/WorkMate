import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenService } from './tokenService';
import { useAuthStore } from '../store/useAuthStore';

// Access environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track token refresh status
let isRefreshing = false;
// Queue to hold requests that failed with 401 while refreshing the token
let failedQueue: Array<{
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Helper to process queued requests
const processQueue = (error: Error | AxiosError | null | unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach access token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 1. Check if token is in Zustand store first (in-memory)
    let token = useAuthStore.getState().accessToken;

    // 2. Fallback to SecureStore if not in store (e.g., during app startup)
    if (!token) {
      token = await tokenService.getAccessToken();
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 and Token Refreshing
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Prevent infinite loops on auth API requests
    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Check if error is 401 Unauthorized and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until token refresh completes
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh API directly to avoid using interceptor recursion
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = response.data;

        // Save new tokens
        await tokenService.saveTokens(newAccessToken, newRefreshToken);

        // Update Zustand global store
        useAuthStore.getState().setAuth(user, newAccessToken);

        // Process queued requests with new token
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth state and log out user
        processQueue(refreshError, null);
        isRefreshing = false;
        await tokenService.clearTokens();
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
