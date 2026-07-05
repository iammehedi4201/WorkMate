import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface ShortcutsSectionProps {
  onNavigateAttendance: () => void;
}

export default function ShortcutsSection({ onNavigateAttendance }: ShortcutsSectionProps) {
  return (
    <View className="bg-[#161616] border border-[#222222] p-5 rounded-lg mb-3">
      <Text className="text-white text-lg font-black mb-4 tracking-tight">Shortcuts</Text>
      <TouchableOpacity
        onPress={onNavigateAttendance}
        activeOpacity={0.8}
        className="flex-row items-center justify-between bg-[#111111] border border-[#222222] p-3 rounded-lg active:bg-[#1a1a1a]">
        <View className="flex-row gap-2 items-center space-x-3.5">
          <View className="w-10 h-10 bg-[#222222] border border-[#333333] rounded-lg items-center justify-center">
            <Ionicons name="time-outline" size={20} color="#ffffff" />
          </View>
          <Text className="text-white font-bold text-[15px] ml-2">My Attendance</Text>
        </View>
        <Feather name="arrow-up-right" size={18} color="#888888" />
      </TouchableOpacity>
    </View>
  );
}
