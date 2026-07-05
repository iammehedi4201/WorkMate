import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

interface AttendanceProfileBarProps {
  user: any;
}

export default function AttendanceProfileBar({ user }: AttendanceProfileBarProps) {
  return (
    <View className="flex-row items-center bg-[#111111] border border-[#1e1e1e] rounded-xl px-3 py-2.5 mb-3">
      <View
        className="overflow-hidden rounded-lg bg-[#222222] mr-2.5"
        style={{ width: 34, height: 34 }}>
        <Image
          source={{
            uri: user?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/2919/2919906.png',
          }}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
          contentFit="cover"
        />
      </View>
      <Text className="text-[#3fc9f1] font-bold text-[15px] flex-1">
        {user?.name || 'Mehedi Hasan'}
      </Text>
      <View className="items-end">
        <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider">
          {user?.designations?.[0] || 'Software Engineer'}
        </Text>
      </View>
    </View>
  );
}
