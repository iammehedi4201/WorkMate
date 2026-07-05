import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

interface ProfileCardProps {
  user: any;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <View className="bg-[#161616] p-5 rounded-lg mb-3 flex-row gap-2 items-center space-x-4">
      <View className="w-20 h-20 rounded-lg overflow-hidden p-1 justify-center items-center">
        <Image
          source={{
            uri: `${process.env.EXPO_PUBLIC_SPACES_URL}${user?.dp}`,
          }}
          style={{ width: '100%', height: '100%', borderRadius: 20 }}
          contentFit="contain"
        />
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-[#888888] text-[13px] font-semibold">Hello,</Text>
        <Text className="text-white text-xl font-black mb-1.5 tracking-tight" numberOfLines={1}>
          {user?.name || 'Sheehan Rahman'}
        </Text>
        <View className="self-start border border-[#333333] px-3 py-1 rounded-lg bg-[#111111]/45">
          <Text className="text-[#888888] text-[11px] font-semibold uppercase tracking-wider">
            {user?.designations?.[0] || 'Employee'}
          </Text>
        </View>
      </View>
    </View>
  );
}
