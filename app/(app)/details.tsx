import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../../src/components/Header';

export default function DetailsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#020202]">
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#020202" />

        {/* Header */}
        <Header
          title="Details"
          showBack
          onBackPress={() => router.back()}
        />

        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-[#161616] p-6 rounded-[28px] border border-[#222222] w-full max-w-sm">
            <Text className="text-2xl font-black text-white mb-3 tracking-tight">Details Screen</Text>
            <Text className="text-[#888888] text-sm leading-relaxed mb-6">
              This details screen demonstrates stack routing in action. We are nested inside the authenticated router group but outside the tabs structure to give you a full screen stack interface.
            </Text>

            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white active:bg-slate-200 py-3.5 rounded-xl justify-center items-center"
            >
              <Text className="text-black font-bold text-sm">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
