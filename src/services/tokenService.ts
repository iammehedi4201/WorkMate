import { secureStore } from './secureStore';
import { User } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_INFO_KEY = 'auth_user_info';

/**
 * Service to manage lifecycle of tokens in SecureStore and user profile inside AsyncStorage.
 */
export const tokenService = {
  async getAccessToken(): Promise<string | null> {
    return await secureStore.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return await secureStore.getItem(REFRESH_TOKEN_KEY);
  },

  async getUserInfo(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(USER_INFO_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      secureStore.setItem(ACCESS_TOKEN_KEY, accessToken),
      secureStore.setItem(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async saveUserInfo(user: User): Promise<void> {
    // Storing in AsyncStorage to avoid SecureStore's 2048 bytes size limit on Android/iOS
    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      secureStore.removeItem(ACCESS_TOKEN_KEY),
      secureStore.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_INFO_KEY),
    ]);
  },
};
