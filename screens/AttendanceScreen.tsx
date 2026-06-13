import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../src/components/Header';
import TopSheetDrawer from '../src/components/TopSheetDrawer';

interface AttendanceScreenProps {
  onNavigateDashboard: () => void;
}

export default function AttendanceScreen({ onNavigateDashboard }: AttendanceScreenProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  // Simulated attendance for June 2026
  const attendanceData = [
    { day: 1, status: 'present', hours: '8.5h' },
    { day: 2, status: 'present', hours: '9.0h' },
    { day: 3, status: 'present', hours: '8.2h' },
    { day: 4, status: 'absent', hours: '-' },
    { day: 5, status: 'present', hours: '8.0h' },
    { day: 8, status: 'present', hours: '8.8h' },
    { day: 9, status: 'present', hours: '8.4h' },
    { day: 10, status: 'present', hours: '9.1h' },
    { day: 11, status: 'holiday', hours: '-' },
    { day: 12, status: 'present', hours: '8.7h' },
    { day: 13, status: 'present', hours: '4.5h' }, // Today (Half day or working)
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'absent':
        return 'bg-red-500/15 border-red-500/30 text-red-400';
      case 'holiday':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      default:
        return 'bg-[#222222] border-[#333333] text-[#888888]';
    }
  };

  const handleToggleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <View className="flex-1 bg-[#020202]">
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#020202" />
        
        {/* Header */}
        <Header
          title="My Attendance"
          showBack
          onBackPress={onNavigateDashboard}
          showMenu
          onMenuPress={() => setIsDrawerOpen(true)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
        >
          {/* Active Session Status */}
          <View className="bg-[#161616] border border-[#222222] p-5 rounded-[28px] mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-white text-lg font-black tracking-tight">Active Session</Text>
                <Text className="text-[#888888] text-[12px] font-medium mt-0.5">June 13, 2026</Text>
              </View>
              <View className={`px-3 py-1 rounded-full border ${isCheckedIn ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <Text className={`font-bold text-[10px] uppercase tracking-wider ${isCheckedIn ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCheckedIn ? 'Checked In' : 'Checked Out'}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center bg-[#111111] p-4 rounded-xl border border-[#222222] mb-5">
              <View className="items-center flex-1 border-r border-[#222222]">
                <Text className="text-[#888888] text-[10px] font-bold uppercase tracking-wider mb-1">Check In</Text>
                <Text className="text-white text-base font-black">09:15 AM</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-[#888888] text-[10px] font-bold uppercase tracking-wider mb-1">Check Out</Text>
                <Text className="text-white text-base font-black">
                  {isCheckedIn ? '--:--' : '06:30 PM'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleToggleCheckIn}
              className={`w-full py-4 rounded-xl items-center justify-center shadow-md ${
                isCheckedIn ? 'bg-[#222222] border border-[#333333]' : 'bg-white'
              }`}
            >
              <Text className={`font-bold text-base ${isCheckedIn ? 'text-white' : 'text-black'}`}>
                {isCheckedIn ? 'Check Out' : 'Check In Now'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Attendance History Grid */}
          <View className="bg-[#161616] border border-[#222222] p-5 rounded-[28px]">
            <Text className="text-white text-lg font-black mb-4 tracking-tight">June 2026 Summary</Text>
            
            <View className="flex-row flex-wrap justify-between">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const matched = attendanceData.find((a) => a.day === day);
                const statusClass = matched ? matched.status : 'default';
                const textClass = matched ? (matched.status === 'present' ? 'text-emerald-400 font-bold' : matched.status === 'absent' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold') : 'text-[#888888]';

                return (
                  <View
                    key={day}
                    className={`w-[18%] aspect-square mb-3.5 border rounded-2xl items-center justify-center ${getStatusColor(
                      statusClass
                    )}`}
                  >
                    <Text className={`text-[13px] font-bold ${textClass}`}>{day}</Text>
                    {matched?.hours && matched.hours !== '-' && (
                      <Text className="text-[8px] text-[#888888] font-bold mt-0.5">{matched.hours}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Top Sheet Drawer */}
      <TopSheetDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen="Attendance"
        onNavigate={(screen) => {
          if (screen === 'Dashboard') {
            onNavigateDashboard();
          }
        }}
      />
    </View>
  );
}
