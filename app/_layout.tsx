import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/services/queryClient';
import { ToastProvider } from '../src/context/ToastContext';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { useAuth } from '../src/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

function Initializer({ children }: { children: React.ReactNode }) {
  const { isInitializing, isAuthenticated, initializeAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Run auth initialization on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle routing redirects when auth state changes
  useEffect(() => {
    if (isInitializing) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated user to login screen
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect authenticated user to app stack
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, isInitializing, segments, router]);

  // Display native loading indicator while checking secure credentials
  if (isInitializing) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <Initializer>
                <Slot />
              </Initializer>
            </ToastProvider>
          </QueryClientProvider>
        </ErrorBoundary>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
