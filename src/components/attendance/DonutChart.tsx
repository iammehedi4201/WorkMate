import React from 'react';
import { View, Text } from 'react-native';

export default function DonutChart({ percentage }: { percentage: number }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 10,
        borderColor: '#e74c3c',
      }}>
      <Text className="text-white text-2xl font-black">{percentage}%</Text>
      <Text className="text-[#888888] text-[11px] font-semibold">Present</Text>
    </View>
  );
}
