import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, visible, onHide }) => {
  const insets = useSafeAreaInsets();
  const animatedValue = useRef(new Animated.Value(-150)).current;
  const [shouldRender, setShouldRender] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.spring(animatedValue, {
        toValue: insets.top + 10,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible, insets.top, animatedValue]);

  if (!shouldRender) return null;

  // Curated theme-based styling (glassmorphism/vibrant look)
  let bgStyles = 'bg-slate-900/90 border-slate-800';
  let textStyles = 'text-white';
  let icon = 'ℹ️';

  if (type === 'success') {
    bgStyles = 'bg-emerald-950/95 border-emerald-900';
    textStyles = 'text-emerald-100';
    icon = '✅';
  } else if (type === 'error') {
    bgStyles = 'bg-red-950/95 border-red-900';
    textStyles = 'text-red-100';
    icon = '❌';
  } else if (type === 'warning') {
    bgStyles = 'bg-amber-950/95 border-amber-900';
    textStyles = 'text-amber-100';
    icon = '⚠️';
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: animatedValue }],
        },
      ]}
    >
      <Pressable
        onPress={onHide}
        className={`flex-row items-center mx-4 p-4 rounded-2xl border ${bgStyles} shadow-lg backdrop-blur-md`}
      >
        <View className="mr-3 justify-center items-center">
          <Text className="text-lg">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className={`font-semibold text-sm leading-relaxed ${textStyles}`}>
            {message}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});
