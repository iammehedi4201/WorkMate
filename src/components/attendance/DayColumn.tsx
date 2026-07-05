import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { DayAttendance, STATUS_CONFIG, DAY_3, DAY_COL_WIDTH } from '../../constants/attendanceConstants';
import { getJsDay } from '../../utils/attendanceHelpers';
import StatusIcon from './StatusIcon';

const DayColumn = React.memo(function DayColumn({
  item,
  year,
  month,
  isToday,
  onPress,
}: {
  item: DayAttendance;
  year: number;
  month: number;
  isToday: boolean;
  onPress: (item: DayAttendance) => void;
}) {
  const cfg = STATUS_CONFIG[item.status];
  const jsDay = getJsDay(year, month, item.date);
  const dayName = DAY_3[jsDay];
  const isWknd = item.status === 'weekend';

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={{ width: DAY_COL_WIDTH }}
      className="items-center h-[100px]">
      {/* Day header – label + date number */}
      <View
        className="w-full items-center py-2 mb-1"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#1e1e1e',
        }}>
        <Text
          className="text-[10px] font-bold mb-0.5"
          style={{ color: isWknd ? '#444444' : '#3a9bd5' }}>
          {dayName}
        </Text>
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: isToday ? '#ffffff' : 'transparent' }}>
          <Text
            className="text-[13px] font-black"
            style={{ color: isToday ? '#000000' : isWknd ? '#3a3a3a' : '#cccccc' }}>
            {item.date}
          </Text>
        </View>
      </View>

      {/* Status badge */}
      <View
        className="w-9 h-9 rounded-xl mt-2 items-center justify-center "
        style={{ backgroundColor: cfg.bg, borderWidth: 1, borderColor: cfg.border }}>
        <StatusIcon status={item.status} size={15} />
      </View>
    </Pressable>
  );
});

export default DayColumn;
