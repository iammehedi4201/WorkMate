import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DayAttendance, STATUS_CONFIG, MONTH_NAMES_LONG, DAY_SHORT } from '../../constants/attendanceConstants';
import { getJsDay } from '../../utils/attendanceHelpers';
import StatusIcon from './StatusIcon';

export default function DayDetailSheet({
  day,
  year,
  month,
  onClose,
}: {
  day: DayAttendance | null;
  year: number;
  month: number;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  // Standard bottom padding for safe area since modal will cover the tab bar now
  const sheetBottomPad = insets.bottom + 24;

  if (!day) return null;
  const cfg = STATUS_CONFIG[day.status];
  const jsDay = getJsDay(year, month, day.date);
  const fullDayName = DAY_SHORT[jsDay];

  return (
    <Modal
      visible={!!day}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View
          className="bg-[#161616] border-t border-[#2a2a2a] rounded-t-3xl px-6 pt-5"
          style={{ paddingBottom: sheetBottomPad }}>
          {/* Handle bar */}
          <View className="w-10 h-1 rounded-full bg-[#333333] self-center mb-5" />

          {/* Date heading */}
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-[#888888] text-xs font-semibold uppercase tracking-widest">
                {MONTH_NAMES_LONG[month]} {year}
              </Text>
              <Text className="text-white text-2xl font-black mt-0.5">
                {fullDayName}, {day.date}
              </Text>
            </View>
            {/* Status badge */}
            <View
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: cfg.bg, borderWidth: 1, borderColor: cfg.border }}>
              <StatusIcon status={day.status} size={13} />
              <Text style={{ color: cfg.color }} className="text-xs font-bold">
                {cfg.label}
              </Text>
            </View>
          </View>

          {/* Separator */}
          <View className="h-px bg-[#222222] mb-5" />

          {/* Details grid */}
          {day.checkIn || day.checkOut || day.hours || day.overtime || day.note ? (
            <View className="gap-3">
              {day.checkIn && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-lg bg-[#1a1a1a] items-center justify-center">
                      <Ionicons name="log-in-outline" size={16} color="#2ecc71" />
                    </View>
                    <Text className="text-[#888888] text-sm font-semibold">Check In</Text>
                  </View>
                  <Text className="text-white text-sm font-bold">{day.checkIn}</Text>
                </View>
              )}
              {day.checkOut && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-lg bg-[#1a1a1a] items-center justify-center">
                      <Ionicons name="log-out-outline" size={16} color="#e74c3c" />
                    </View>
                    <Text className="text-[#888888] text-sm font-semibold">Check Out</Text>
                  </View>
                  <Text className="text-white text-sm font-bold">{day.checkOut}</Text>
                </View>
              )}
              {day.hours && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-lg bg-[#1a1a1a] items-center justify-center">
                      <Ionicons name="time-outline" size={16} color="#3498db" />
                    </View>
                    <Text className="text-[#888888] text-sm font-semibold">Working Hours</Text>
                  </View>
                  <Text className="text-white text-sm font-bold">{day.hours}</Text>
                </View>
              )}
              {day.overtime && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-lg bg-[#1a1a1a] items-center justify-center">
                      <Ionicons name="flash-outline" size={16} color="#f1c40f" />
                    </View>
                    <Text className="text-[#888888] text-sm font-semibold">Overtime</Text>
                  </View>
                  <Text className="text-[#f1c40f] text-sm font-bold">{day.overtime}</Text>
                </View>
              )}
              {day.note && (
                <View
                  className="flex-row items-center gap-2 mt-1 p-3 rounded-xl"
                  style={{ backgroundColor: cfg.bg, borderWidth: 1, borderColor: cfg.border }}>
                  <Ionicons name="information-circle-outline" size={16} color={cfg.color} />
                  <Text style={{ color: cfg.color }} className="text-sm font-semibold">
                    {day.note}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="items-center py-4">
              <Text className="text-[#555555] text-sm">No attendance data for this day.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
