import React from 'react';
import { View, Text } from 'react-native';

export default function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <View className="flex-1 bg-[#111111] border border-[#1e1e1e] rounded-xl p-3 items-center overflow-hidden">
      <View className="mb-1">{icon}</View>
      <Text className="text-[#666666] text-[10px] font-semibold text-center mb-1" numberOfLines={2}>
        {label}
      </Text>
      <Text className="text-white text-2xl font-black">{String(value)}</Text>
    </View>
  );
}
