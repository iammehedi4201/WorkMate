import { secureStore } from './secureStore';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

/**
 * Service to manage lifecycle of tokens inside SecureStore.
 */
export const tokenService = {
  async getAccessToken(): Promise<string | null> {
    return await secureStore.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return await secureStore.getItem(REFRESH_TOKEN_KEY);
  },

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      secureStore.setItem(ACCESS_TOKEN_KEY, accessToken),
      secureStore.setItem(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      secureStore.removeItem(ACCESS_TOKEN_KEY),
      secureStore.removeItem(REFRESH_TOKEN_KEY),
    ]);
  },
};
