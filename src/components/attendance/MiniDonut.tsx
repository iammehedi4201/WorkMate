import React from 'react';
import { View, Text } from 'react-native';

export default function MiniDonut({ taken, total, color }: { taken: number; total: number; color: string }) {
  return (
    <View
      className="items-center justify-center shrink-0"
      style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 4, borderColor: color }}>
      <Text className="text-white text-[10px] font-black">
        {taken}/{total}
      </Text>
    </View>
  );
}
