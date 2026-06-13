import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <View className="flex-row items-center justify-between px-5 py-4 bg-[#020202] border-b border-[#111111]" style={{ zIndex: 30, position: 'relative' }}>
      {/* Left section: Back button or placeholder for symmetry */}
      <View className="w-12 items-start justify-center">
        {showBack && (
          <TouchableOpacity
            onPress={onBackPress}
            className="flex-row items-center space-x-1 py-1 pr-2">
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
            <Text className="text-white text-base font-bold">Back</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Middle section: Logo or Title */}
      <View className="flex-1 ">
        {showLogo ? (
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 24, height: 24, marginRight: 8 }}
              contentFit="contain"
            />
            <Text className="text-white text-xl font-bold tracking-tight">My Ant App</Text>
          </View>
        ) : (
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      {/* Right section: Menu button or placeholder for symmetry */}
      <View className="w-12 items-end justify-center">
        {showMenu && (
          <TouchableOpacity
            onPress={onMenuPress}
            className="w-11 h-11 bg-[#161616] border border-[#262626] rounded-xl items-center justify-center active:bg-[#222222]">
            <Ionicons name="menu" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
