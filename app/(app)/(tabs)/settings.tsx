import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../../src/store/useSettingsStore';
import { useToast } from '../../../src/hooks/useToast';
import { useHeader } from '../../../src/context/HeaderContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, notificationsEnabled, setTheme, toggleNotifications } = useSettingsStore();
  const { showToast } = useToast();
  useHeader({
    title: 'Settings',
    showMenu: true,
    activeScreen: 'Settings',
    onNavigate: screen => {
      if (screen === 'Dashboard' || screen === 'Attendance') {
        router.push('/');
      }
    },
  });

  const handleToastTest = (type: 'success' | 'error' | 'warning' | 'info') => {
    showToast(`This is a custom ${type} toast notification!`, type);
  };

  return (
    <View className="flex-1 bg-[#020202]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}>
        {/* Persisted store demo */}
        <View className="bg-[#161616] border border-[#222222] p-5 rounded-[28px] mb-6">
          <Text className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-4">
            Zustand Persist storage Demo
          </Text>

          <View className="flex-row justify-between items-center pb-4 border-b border-[#222222]">
            <View>
              <Text className="text-white font-bold text-base">App Notifications</Text>
              <Text className="text-[#888888] text-xs mt-0.5">Toggle system wide alerts</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={() => {
                toggleNotifications();
                showToast(
                  `Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`,
                  'info',
                );
              }}
              trackColor={{ false: '#222222', true: '#ffffff' }}
              thumbColor={notificationsEnabled ? '#000000' : '#888888'}
            />
          </View>

          <View className="pt-4">
            <Text className="text-white font-bold text-base mb-3">Display Theme</Text>
            <View className="flex-row space-x-2">
              {(['light', 'dark', 'system'] as const).map(mode => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => {
                    setTheme(mode);
                    showToast(`Theme updated to: ${mode}`, 'success');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg border items-center justify-center ${
                    theme === mode
                      ? 'bg-white border-white'
                      : 'bg-[#111111] border-[#222222] active:bg-[#1a1a1a]'
                  }`}>
                  <Text
                    className={`text-sm font-semibold capitalize ${
                      theme === mode ? 'text-black' : 'text-[#888888]'
                    }`}>
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Toast Notification Testing */}
        <View className="bg-[#161616] border border-[#222222] p-5 rounded-[28px]">
          <Text className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-4">
            Toast Notification Engine
          </Text>
          <Text className="text-[#888888] text-xs mb-4 leading-relaxed">
            Test our custom animation toast context engine with different feedback severities:
          </Text>

          <View className="flex-row flex-wrap gap-2.5">
            <TouchableOpacity
              onPress={() => handleToastTest('success')}
              className="flex-grow min-w-[45%] bg-emerald-500/10 active:bg-emerald-500/20 border border-emerald-500/20 py-3 rounded-xl items-center">
              <Text className="text-emerald-400 font-bold text-sm">✅ Success</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleToastTest('error')}
              className="flex-grow min-w-[45%] bg-red-500/10 active:bg-red-500/20 border border-red-500/20 py-3 rounded-xl items-center">
              <Text className="text-red-400 font-bold text-sm">❌ Error</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleToastTest('warning')}
              className="flex-grow min-w-[45%] bg-amber-500/10 active:bg-amber-500/20 border border-amber-500/20 py-3 rounded-xl items-center">
              <Text className="text-amber-400 font-bold text-sm">⚠️ Warning</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleToastTest('info')}
              className="flex-grow min-w-[45%] bg-blue-500/10 active:bg-blue-500/20 border border-blue-500/20 py-3 rounded-xl items-center">
              <Text className="text-blue-400 font-bold text-sm">ℹ️ Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
