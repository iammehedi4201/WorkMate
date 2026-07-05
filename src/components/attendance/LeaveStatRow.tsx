import React from 'react';
import { View, Text } from 'react-native';

export default function LeaveStatRow({
  label,
  value,
  dotColor,
}: {
  label: string;
  value: number;
  dotColor: string;
}) {
  return (
    <View className="flex-row items-center mb-0.5">
      <Text className="text-[#666666] text-[10px] font-semibold w-16">{label}:</Text>
      <Text style={{ color: dotColor }} className="text-[10px] font-bold">
        {String(value).padStart(2, '0')}
      </Text>
      <View
        className="rounded-full ml-1"
        style={{ width: 6, height: 6, backgroundColor: dotColor }}
      />
    </View>
  );
}
