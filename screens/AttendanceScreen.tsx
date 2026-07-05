import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Modal, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../src/hooks/useAuth';
import { useHeader } from '../src/context/HeaderContext';
import { attendanceService } from '../src/services/attendanceService';
import { BackendAttendance } from '../src/types/attendance';

interface AttendanceScreenProps {
  onNavigateDashboard: () => void;
}

import { MONTHS, MONTH_NAMES_LONG } from '../src/constants/attendanceConstants';
import { buildAttendanceDataFromBackend, getDaysInMonth } from '../src/utils/attendanceHelpers';
import StatBox from '../src/components/attendance/StatBox';
import TimelineCalendar from '../src/components/attendance/TimelineCalendar';
import AttendanceProfileBar from '../src/components/attendance/AttendanceProfileBar';
import AttendanceOverviewCard from '../src/components/attendance/AttendanceOverviewCard';
import DatePickerModal from '../src/components/attendance/DatePickerModal';

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AttendanceScreen({ onNavigateDashboard }: AttendanceScreenProps) {
  const { user } = useAuth();

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState<'percent' | 'count'>('percent');
  const [pickerYear, setPickerYear] = useState(today.getFullYear());

  const [backendLogs, setBackendLogs] = useState<BackendAttendance[]>([]);
  const [leavesData, setLeavesData] = useState<any>({
    recLeaves: 17,
    sickLeaves: 7,
    totalRecreationLeaveTaken: 0,
    totalSicksLeaveTaken: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const startYear = selectedYear;
        const startMonth = String(selectedMonth + 1).padStart(2, '0');
        const startDate = `${startYear}-${startMonth}-01`;
        const lastDay = getDaysInMonth(selectedYear, selectedMonth);
        const endDate = `${startYear}-${startMonth}-${String(lastDay).padStart(2, '0')}T23:59:59`;

        const data = await attendanceService.getMyMonthlyAttendance(startDate, endDate);
        if (active) {
          setBackendLogs(data.attendances || []);
          setLeavesData(data.leaves || {});
        }
      } catch (error) {
        console.error('Failed to load monthly attendance:', error);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [selectedYear, selectedMonth]);

  useHeader({
    title: 'My Attendance',
    showBack: true,
    onBackPress: onNavigateDashboard,
    showMenu: true,
    activeScreen: 'Attendance',
    onNavigate: screen => {
      if (screen === 'Dashboard') onNavigateDashboard();
    },
  });

  // ─── Data ──────────────────────────────────────────────────────────────────
  const attendance = useMemo(
    () => buildAttendanceDataFromBackend(selectedYear, selectedMonth, backendLogs),
    [selectedYear, selectedMonth, backendLogs],
  );

  const stats = useMemo(() => {
    const present = attendance.filter(d => d.status === 'present').length;
    const late = attendance.filter(d => d.status === 'late').length;
    const absent = attendance.filter(d => d.status === 'absent').length;
    const sickLeave = attendance.filter(d => d.status === 'sick').length;
    const annualLeave = attendance.filter(d => d.status === 'annual').length;
    const latePenalty = attendance.filter(d => d.status === 'latepenalty').length;
    const weekends = attendance.filter(d => d.status === 'weekend').length;
    const workingDays = getDaysInMonth(selectedYear, selectedMonth) - weekends;

    const annualLeaveTotal = leavesData.recLeaves || 17;
    const annualLeaveTaken = leavesData.totalRecreationLeaveTaken || 0;
    const sickLeaveTotal = leavesData.sickLeaves || 7;
    const sickLeaveTaken = leavesData.totalSicksLeaveTaken || 0;

    return {
      present,
      late,
      absent,
      sickLeave,
      annualLeave,
      latePenalty,
      weekends,
      workingDays,
      annualLeaveTotal,
      annualLeaveTaken,
      annualLeaveRemaining: Math.max(0, annualLeaveTotal - annualLeaveTaken),
      sickLeaveTotal,
      sickLeaveTaken,
      sickLeaveRemaining: Math.max(0, sickLeaveTotal - sickLeaveTaken),
    };
  }, [attendance, selectedYear, selectedMonth, leavesData]);

  const presentPercent =
    stats.workingDays > 0 ? Math.round((stats.present / stats.workingDays) * 100) : 0;

  const monthShort = MONTHS[selectedMonth];
  const monthLong = MONTH_NAMES_LONG[selectedMonth];

  const statVal = (count: number) =>
    viewMode === 'percent' && stats.workingDays > 0
      ? `${Math.round((count / stats.workingDays) * 100)}%`
      : String(count).padStart(2, '0');

  const openPicker = () => {
    setPickerYear(selectedYear);
    setShowDatePicker(true);
  };

  const confirmPicker = (monthIdx: number) => {
    setSelectedMonth(monthIdx);
    setSelectedYear(pickerYear);
    setShowDatePicker(false);
  };

  return (
    <View className="flex-1 bg-[#020202]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 16,
          flexGrow: 1,
        }}>
        <AttendanceProfileBar user={user} />
        <AttendanceOverviewCard
          monthLong={monthLong}
          selectedYear={selectedYear}
          isLoading={isLoading}
          viewMode={viewMode}
          setViewMode={setViewMode}
          presentPercent={presentPercent}
          stats={stats}
          statVal={statVal}
        />

        {/* ── Monthly Section Header ──────────────────────────────────────── */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-[18px]">
            <Text className="text-white font-black">{monthLong} </Text>
            <Text className="text-[#888888] font-bold">Attendance</Text>
          </Text>
          <Pressable
            onPress={openPicker}
            className="flex-row items-center bg-[#111111] border border-[#222222] rounded-xl px-3 py-1.5">
            <Ionicons name="calendar-outline" size={15} color="#888888" />
            <Text className="text-[#aaaaaa] text-[13px] font-semibold ml-1.5">
              {monthShort} {selectedYear}
            </Text>
          </Pressable>
        </View>

        {/* ── Stat Boxes ──────────────────────────────────────────────────── */}
        <View className="flex-row gap-2 mb-2">
          <StatBox
            icon={<Ionicons name="close" size={16} color="#e74c3c" />}
            label="Absent"
            value={stats.absent}
          />
          <StatBox
            icon={<MaterialCommunityIcons name="thermometer" size={16} color="#e67e22" />}
            label="Sick Leave"
            value={stats.sickLeave}
          />
        </View>
        <View className="flex-row gap-2 mb-4">
          <StatBox
            icon={<FontAwesome5 name="plane" size={13} color="#3498db" />}
            label="Annual Leave"
            value={stats.annualLeave}
          />
          <StatBox
            icon={<Ionicons name="time-outline" size={16} color="#e67e22" />}
            label="Late"
            value={stats.late}
          />
          <StatBox
            icon={<Ionicons name="warning-outline" size={16} color="#e67e22" />}
            label={'Late Penalty'}
            value={stats.latePenalty}
          />
        </View>

        {/* ── Working Days / Weekends ─────────────────────────────────────── */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[#888888] text-[13px] font-semibold">
            Working Days:{' '}
            <Text className="text-white font-black">
              {String(stats.workingDays).padStart(2, '0')}
            </Text>
          </Text>
          <Text className="text-[#888888] text-[13px] font-semibold">
            Weekends:{' '}
            <Text className="text-white font-black">{String(stats.weekends).padStart(2, '0')}</Text>
          </Text>
        </View>

        {/* ── Continuous Horizontal Timeline Calendar ─────────────────────── */}
        <TimelineCalendar year={selectedYear} month={selectedMonth} attendance={attendance} />
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        pickerYear={pickerYear}
        setPickerYear={setPickerYear}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onConfirm={confirmPicker}
      />
    </View>
  );
}
