import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, Text, TouchableOpacity, View, PanResponder } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface TopSheetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TopSheetDrawer({
  isOpen,
  onClose,
  activeScreen,
  onNavigate,
}: TopSheetDrawerProps) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const drawerHeight = 390 + insets.bottom;
  const progress = useSharedValue(0);
  const animatedHeight = useSharedValue(drawerHeight);
  const [isModalVisible, setIsModalVisible] = useState(isOpen);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsModalVisible(true);
      animatedHeight.value = drawerHeight;
      setIsFullScreen(false);
      progress.value = withTiming(1, { duration: 300 });
    } else {
      progress.value = withTiming(0, { duration: 300 }, finished => {
        if (finished) {
          runOnJS(setIsModalVisible)(false);
        }
      });
    }
  }, [isOpen]);

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  });

  const drawerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [animatedHeight.value, 0]);
    return {
      height: animatedHeight.value,
      transform: [{ translateY }],
    };
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newHeight = drawerHeight - gestureState.dy;
        if (newHeight <= SCREEN_HEIGHT) {
          animatedHeight.value = Math.max(0, newHeight);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -100) {
          animatedHeight.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
          runOnJS(setIsFullScreen)(true);
        } else if (gestureState.dy > 100) {
          if (animatedHeight.value < drawerHeight - 50) {
            runOnJS(onClose)();
          } else {
            animatedHeight.value = withTiming(drawerHeight, { duration: 250 });
            runOnJS(setIsFullScreen)(false);
          }
        } else {
          const midPoint = (drawerHeight + SCREEN_HEIGHT) / 2;
          if (animatedHeight.value > midPoint) {
            animatedHeight.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
            runOnJS(setIsFullScreen)(true);
          } else {
            animatedHeight.value = withTiming(drawerHeight, { duration: 250 });
            runOnJS(setIsFullScreen)(false);
          }
        }
      },
    })
  ).current;

  const handleLogout = async () => {
    onClose();
    await logout();
    showToast('Logged out successfully', 'info');
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      {/* Backdrop */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 40,
          },
          backdropStyle,
        ]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Drawer Sheet */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#161616',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: insets.bottom + 20,
            zIndex: 50,
            borderTopWidth: 1,
            borderTopColor: '#262626',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
          drawerStyle,
        ]}>
        {/* Drag Handle */}
        <View
          {...panResponder.panHandlers}
          style={{
            alignItems: 'center',
            paddingVertical: 12,
            width: '100%',
          }}>
          <View
            style={{
              width: 40,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: '#444444',
            }}
          />
        </View>
        <View style={isFullScreen ? { flex: 1 } : null}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center space-x-2">
              <Image
                source={require('../../assets/logo.png')}
                style={{ width: 32, height: 32, marginRight: 8 }}
                contentFit="contain"
              />
              <Text className="text-white text-xl font-bold tracking-tight mt-3">My Ant App</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-[#222222] border border-[#333333] rounded-xl items-center justify-center active:bg-[#2e2e2e]">
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View className="space-y-3">
            {/* Dashboard */}
            <TouchableOpacity
              onPress={() => {
                onNavigate('Dashboard');
                onClose();
              }}
              className={`flex-row items-center px-4 py-3.5 rounded-xl border ${
                activeScreen === 'Dashboard'
                  ? 'border-[#444444] bg-[#222222]/35'
                  : 'border-transparent'
              }`}>
              <Ionicons name="speedometer-outline" size={20} color="#ffffff" className="mr-3" />
              <Text className="text-white font-bold text-[16px] ml-3">Dashboard</Text>
            </TouchableOpacity>

            {/* My Attendance */}
            <TouchableOpacity
              onPress={() => {
                onNavigate('Attendance');
                onClose();
              }}
              className={`flex-row items-center px-4 py-3.5 rounded-xl border ${
                activeScreen === 'Attendance'
                  ? 'border-[#444444] bg-[#222222]/35'
                  : 'border-transparent'
              }`}>
              <Ionicons name="calendar-outline" size={20} color="#ffffff" className="mr-3" />
              <Text className="text-white font-bold text-[16px] ml-3">My Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section */}
        <View>
          {/* Divider */}
          <View className="h-[1px] bg-[#222222] mb-5" />

          {/* User profile */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <Text className="text-2xl mr-2">🍄</Text>
              <Text className="text-white font-bold text-[16px]">
                {user?.name || 'Sheehan Rahman'}
              </Text>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity onPress={handleLogout} className="flex-row items-center mt-5 px-1 py-1">
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
            <Text className="text-white font-bold text-[16px] ml-3.5">Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
