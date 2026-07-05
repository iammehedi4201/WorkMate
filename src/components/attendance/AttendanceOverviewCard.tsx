import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import DonutChart from './DonutChart';
import MiniDonut from './MiniDonut';
import LeaveStatRow from './LeaveStatRow';

interface AttendanceOverviewCardProps {
  monthLong: string;
  selectedYear: number;
  isLoading: boolean;
  viewMode: 'percent' | 'count';
  setViewMode: (mode: 'percent' | 'count') => void;
  presentPercent: number;
  stats: {
    present: number;
    late: number;
    absent: number;
    annualLeaveTaken: number;
    annualLeaveTotal: number;
    annualLeaveRemaining: number;
    sickLeaveTaken: number;
    sickLeaveTotal: number;
    sickLeaveRemaining: number;
  };
  statVal: (val: number) => string | number;
}

export default function AttendanceOverviewCard({
  monthLong,
  selectedYear,
  isLoading,
  viewMode,
  setViewMode,
  presentPercent,
  stats,
  statVal,
}: AttendanceOverviewCardProps) {
  return (
    <View className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[18px] font-black">
          <Text className="text-white">
            {monthLong} {selectedYear}{' '}
          </Text>
          <Text className="text-[#888888] font-bold">Attendance Overview</Text>
        </Text>
        {isLoading && <ActivityIndicator size="small" color="#3fc9f1" />}
      </View>

      {/* % / # Toggle */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-[#888888] text-xs font-semibold">% of Attendance</Text>
        <View className="flex-row bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
          <Pressable
            onPress={() => setViewMode('percent')}
            className={`px-3 py-1 ${viewMode === 'percent' ? 'bg-[#2a2a2a]' : ''}`}>
            <Text
              className={`text-sm font-bold ${viewMode === 'percent' ? 'text-white' : 'text-[#555555]'}`}>
              %
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('count')}
            className={`px-3 py-1 ${viewMode === 'count' ? 'bg-[#2a2a2a]' : ''}`}>
            <Text
              className={`text-sm font-bold ${viewMode === 'count' ? 'text-white' : 'text-[#555555]'}`}>
              #
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Donut + Stats */}
      <View className="flex-row items-center justify-between mb-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
        <DonutChart percentage={presentPercent} />
        <View className="flex-1 pl-6 gap-3">
          <View className="flex-row items-center justify-end">
            <Text className="text-[#888888] text-[13px] font-semibold w-16">Present:</Text>
            <Text className="text-[#2ecc71] text-[13px] font-bold">
              {statVal(stats.present)}
            </Text>
            <View className="w-2 h-2 rounded-full bg-[#2ecc71] ml-1.5" />
          </View>
          <View className="flex-row items-center justify-end">
            <Text className="text-[#888888] text-[13px] font-semibold w-16">Late:</Text>
            <Text className="text-[#f1c40f] text-[13px] font-bold">{statVal(stats.late)}</Text>
            <View className="w-2 h-2 rounded-full bg-[#f1c40f] ml-1.5" />
          </View>
          <View className="flex-row items-center justify-end">
            <Text className="text-[#888888] text-[13px] font-semibold w-16">Absent:</Text>
            <Text className="text-[#e74c3c] text-[13px] font-bold">
              {statVal(stats.absent)}
            </Text>
            <View className="w-2 h-2 rounded-full bg-[#e74c3c] ml-1.5" />
          </View>
        </View>
      </View>

      {/* Leave Cards */}
      <View className="flex-row gap-2">
        <View className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-2 py-3">
          <Text className="text-[#cccccc] text-xs font-bold mb-2">Annual Leave</Text>
          <View className="flex-row items-center gap-1">
            <MiniDonut
              taken={stats.annualLeaveTaken}
              total={stats.annualLeaveTotal}
              color="#3498db"
            />
            <View className="flex-1">
              <LeaveStatRow label="Total" value={stats.annualLeaveTotal} dotColor="#aaaaaa" />
              <LeaveStatRow label="Taken" value={stats.annualLeaveTaken} dotColor="#3498db" />
              <LeaveStatRow
                label="Remaining"
                value={stats.annualLeaveRemaining}
                dotColor="#27ae60"
              />
            </View>
          </View>
        </View>
        <View className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-2 py-3">
          <Text className="text-[#cccccc] text-xs font-bold mb-2">Sick Leave</Text>
          <View className="flex-row items-center gap-1">
            <MiniDonut
              taken={stats.sickLeaveTaken}
              total={stats.sickLeaveTotal}
              color="#e67e22"
            />
            <View className="flex-1">
              <LeaveStatRow label="Total" value={stats.sickLeaveTotal} dotColor="#aaaaaa" />
              <LeaveStatRow label="Taken" value={stats.sickLeaveTaken} dotColor="#e67e22" />
              <LeaveStatRow
                label="Remaining"
                value={stats.sickLeaveRemaining}
                dotColor="#27ae60"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
