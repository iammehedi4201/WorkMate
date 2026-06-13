import { QueryClient, focusManager } from '@tanstack/react-query';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { AxiosError } from 'axios';

/**
 * Configure TanStack Query client.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: unknown) => {
        // Don't retry on client validation errors or 401s
        if (error instanceof AxiosError) {
          if (error.response?.status === 401 || error.response?.status === 400 || error.response?.status === 422) {
            return false;
          }
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes cache lifetime
      refetchOnWindowFocus: Platform.OS === 'web', // Custom AppState focus listener is used for native
    },
  },
});

// Sync React Query focus manager with React Native AppState.
// This triggers automatic background updates when the user re-opens the app.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (status: AppStateStatus) => {
    focusManager.setFocused(status === 'active');
  });
}
