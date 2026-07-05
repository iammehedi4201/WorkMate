import React, { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { DayAttendance, AttendanceStatus, STATUS_CONFIG, DAY_COL_WIDTH } from '../../constants/attendanceConstants';
import DayColumn from './DayColumn';
import DayDetailSheet from './DayDetailSheet';
import StatusIcon from './StatusIcon';

export default function TimelineCalendar({
  year,
  month,
  attendance,
}: {
  year: number;
  month: number;
  attendance: DayAttendance[];
}) {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<DayAttendance | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  // Scroll to today on first render
  const handleLayout = useCallback(() => {
    const todayIdx = attendance.findIndex(
      d => d.date === today.getDate() && year === today.getFullYear() && month === today.getMonth(),
    );
    if (todayIdx >= 0 && scrollRef.current) {
      // Centre today as much as possible
      const offset = Math.max(0, todayIdx * DAY_COL_WIDTH - 100);
      scrollRef.current.scrollTo({ x: offset, animated: false });
    }
  }, [attendance, year, month, today]);

  return (
    <>
      <View className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden flex-1 justify-between">
        <View className="flex-1 justify-center py-2">
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="normal"
            onLayout={handleLayout}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 10, paddingTop: 4 }}>
            {attendance.map(item => {
              const isToday =
                item.date === today.getDate() &&
                year === today.getFullYear() &&
                month === today.getMonth();
              return (
                <DayColumn
                  key={item.date}
                  item={item}
                  year={year}
                  month={month}
                  isToday={isToday}
                  onPress={setSelectedDay}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Legend */}
        <View className="flex-row flex-wrap justify-center gap-x-4 gap-y-3 px-4 pb-4 pt-3 border-t border-[#1a1a1a]">
          {(
            [
              'present',
              'late',
              'latepenalty',
              'absent',
              'sick',
              'annual',
              'weekend',
            ] as AttendanceStatus[]
          ).map(s => (
            <View key={s} className="flex-row items-center gap-1.5">
              <View
                className="w-5 h-5 rounded-lg items-center justify-center"
                style={{
                  backgroundColor: STATUS_CONFIG[s].bg,
                  borderWidth: 1,
                  borderColor: STATUS_CONFIG[s].border,
                }}>
                <StatusIcon status={s} size={11} />
              </View>
              <Text className="text-[#555555] text-[10px] font-semibold">
                {STATUS_CONFIG[s].label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <DayDetailSheet
        day={selectedDay}
        year={year}
        month={month}
        onClose={() => setSelectedDay(null)}
      />
    </>
  );
}
