import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showMenu?: boolean;
  onMenuPress?: () => void;
  showLogo?: boolean;
}

export default function Header({
  title,
  showBack = false,
  onBackPress,
  showMenu = false,
  onMenuPress,
  showLogo = false,
}: HeaderProps) {
  return (
    <View
      className="flex-row items-center justify-between px-5 py-4 bg-[#020202] border-b border-[#111111]"
      style={{ zIndex: 30, position: 'relative' }}>
      {/* Left section: Back button or placeholder for symmetry */}
      {!showLogo && (
        <View className="w-20 items-start justify-center">
          {showBack && (
            <Pressable
              onPress={onBackPress}
              className="w-11 h-11 bg-[#161616] border border-[#262626] rounded-xl items-center justify-center active:bg-[#222222]">
              <Ionicons name="chevron-back" size={24} color="#ffffff" style={{ marginRight: 2 }} />
            </Pressable>
          )}
        </View>
      )}

      {/* Middle section: Logo or Title */}
      {showLogo ? (
        <View className="flex-1 items-start justify-center">
          <View className="flex-row items-center justify-center">
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 28, height: 28, marginRight: 8 }}
              contentFit="contain"
            />
            <Text className="text-white text-2xl font-bold tracking-tight">My Ant App</Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-2xl font-bold text-center" numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      {/* Right section: Menu button or placeholder for symmetry */}
      <View className="w-20 items-end justify-center">
        {showMenu && (
          <Pressable
            onPress={onMenuPress}
            className="w-11 h-11 bg-[#161616] border border-[#262626] rounded-xl items-center justify-center active:bg-[#222222]">
            <Ionicons name="menu" size={24} color="#ffffff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
