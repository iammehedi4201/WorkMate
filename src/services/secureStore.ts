import * as SecureStore from 'expo-secure-store';

/**
 * Standard utility wrapper for Expo Secure Store.
 * Expo Secure Store encrypts data on disk.
 */
export const secureStore = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`SecureStore Error saving key "${key}":`, error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`SecureStore Error fetching key "${key}":`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`SecureStore Error deleting key "${key}":`, error);
    }
  },
};
