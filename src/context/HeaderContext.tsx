import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';

export interface HeaderConfig {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showMenu?: boolean;
  showLogo?: boolean;
  activeScreen?: string;
  onNavigate?: (screen: string) => void;
}

interface HeaderContextType {
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<Omit<HeaderConfig, 'onBackPress' | 'onNavigate'>>({
    showLogo: true,
    showMenu: true,
    activeScreen: 'Dashboard',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const callbacksRef = useRef<{
    onBackPress?: () => void;
    onNavigate?: (screen: string) => void;
  }>({});

  const setConfig = useCallback((newConfig: HeaderConfig) => {
    // Store latest callback references in mutable ref to prevent infinite re-render loops
    callbacksRef.current = {
      onBackPress: newConfig.onBackPress,
      onNavigate: newConfig.onNavigate,
    };

    // Shallow compare static layout/UI values to only trigger renders when they actually change
    setConfigState(prev => {
      if (
        prev.title !== newConfig.title ||
        prev.showBack !== newConfig.showBack ||
        prev.showMenu !== newConfig.showMenu ||
        prev.showLogo !== newConfig.showLogo ||
        prev.activeScreen !== newConfig.activeScreen
      ) {
        return {
          title: newConfig.title,
          showBack: newConfig.showBack,
          showMenu: newConfig.showMenu,
          showLogo: newConfig.showLogo,
          activeScreen: newConfig.activeScreen,
        };
      }
      return prev;
    });
  }, []);

  const fullConfig: HeaderConfig = {
    ...config,
    onBackPress: useCallback(() => callbacksRef.current.onBackPress?.(), []),
    onNavigate: useCallback((screen: string) => callbacksRef.current.onNavigate?.(screen), []),
  };

  return (
    <HeaderContext.Provider value={{ config: fullConfig, setConfig, isDrawerOpen, setIsDrawerOpen }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = (screenConfig?: HeaderConfig) => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }

  const { config, setConfig, isDrawerOpen, setIsDrawerOpen } = context;
  const isFocused = useIsFocused();

  // Destructure screenConfig properties to prevent unstable object references in dependency array
  const title = screenConfig?.title;
  const showBack = screenConfig?.showBack;
  const onBackPress = screenConfig?.onBackPress;
  const showMenu = screenConfig?.showMenu;
  const showLogo = screenConfig?.showLogo;
  const activeScreen = screenConfig?.activeScreen;
  const onNavigate = screenConfig?.onNavigate;
  const hasConfig = screenConfig !== undefined;

  // Set the screen config on mount/updates/focus
  useEffect(() => {
    if (hasConfig && isFocused) {
      setConfig({
        title,
        showBack,
        onBackPress,
        showMenu,
        showLogo,
        activeScreen,
        onNavigate,
      });
    }
  }, [
    isFocused,
    hasConfig,
    title,
    showBack,
    onBackPress,
    showMenu,
    showLogo,
    activeScreen,
    onNavigate,
    setConfig,
  ]);

  return {
    config,
    setHeaderConfig: setConfig,
    isDrawerOpen,
    setIsDrawerOpen,
  };
};
