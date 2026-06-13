import { useState, useEffect, useRef, useCallback } from 'react';
import { Keyboard, Platform, ScrollView, LayoutChangeEvent } from 'react-native';

export function useKeyboardAvoidance(offset: number = 80, delay: number = 350) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const fieldPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleFieldLayout = useCallback(
    (field: string) => (e: LayoutChangeEvent) => {
      fieldPositions.current[field] = e.nativeEvent.layout.y;
    },
    [],
  );

  const scrollToField = useCallback(
    (field: string) => {
      setTimeout(() => {
        const y = fieldPositions.current[field];
        if (y !== undefined && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            y: Math.max(0, y - offset),
            animated: true,
          });
        }
      }, delay);
    },
    [offset, delay],
  );

  return {
    scrollViewRef,
    keyboardHeight,
    handleFieldLayout,
    scrollToField,
  };
}
