import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Production-ready Error Boundary component.
 * Catches JavaScript errors anywhere in their child component tree.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, send this crash report to services like Sentry/Bugsnag
    console.error('ErrorBoundary caught an unhandled crash:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center px-6">
          <View className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <Text className="text-3xl font-extrabold text-red-600 mb-2">Oops!</Text>
            <Text className="text-lg font-semibold text-slate-800 mb-4">
              Something went wrong
            </Text>
            <Text className="text-slate-500 mb-6">
              The application encountered an unexpected error. You can try restarting or resetting the app.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView className="max-h-40 bg-slate-100 p-3 rounded-xl mb-6">
                <Text className="text-xs font-mono text-red-700">
                  {this.state.error.toString()}
                </Text>
                {this.state.error.stack && (
                  <Text className="text-[10px] font-mono text-slate-500 mt-2">
                    {this.state.error.stack}
                  </Text>
                )}
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={this.handleReset}
              className="bg-blue-600 active:bg-blue-700 py-3.5 rounded-xl justify-center items-center shadow-sm"
            >
              <Text className="text-white font-bold text-base">Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
