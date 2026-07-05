import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Modal, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
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

// ─── Constants ─────────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Fixed column width for each day in the timeline
const DAY_COL_WIDTH = 58;

// ─── Types ────────────────────────────────────────────────────────────────────
type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'sick'
  | 'annual'
  | 'latepenalty'
  | 'holiday'
  | 'weekend';

interface DayAttendance {
  date: number; // 1-31
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  hours?: string;
  overtime?: string;
  note?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isWeekend(year: number, month: number, day: number) {
  const d = new Date(year, month, day).getDay();
  return d === 0 || d === 6;
}

function getJsDay(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

const mapStatus = (name?: string): AttendanceStatus => {
  if (!name) return 'absent';
  const lower = name.toLowerCase();
  if (lower.includes('present')) return 'present';
  if (lower.includes('late penalty')) return 'latepenalty';
  if (lower.includes('late')) return 'late';
  if (lower.includes('absent')) return 'absent';
  if (lower.includes('sick')) return 'sick';
  if (lower.includes('annual')) return 'annual';
  if (lower.includes('holiday')) return 'holiday';
  if (lower.includes('weekend')) return 'weekend';
  return 'absent';
};

function buildAttendanceDataFromBackend(
  year: number,
  month: number,
  backendLogs: BackendAttendance[]
): DayAttendance[] {
  const total = getDaysInMonth(year, month);
  const today = new Date();
  const result: DayAttendance[] = [];

  const logMap = new Map<number, BackendAttendance>();
  backendLogs.forEach(log => {
    if (log.date) {
      const datePart = typeof log.date === 'string' ? log.date.split('T')[0] : '';
      const parts = datePart.split('-');
      if (parts.length === 3) {
        const d = parseInt(parts[2], 10);
        logMap.set(d, log);
      } else {
        const d = new Date(log.date).getDate();
        logMap.set(d, log);
      }
    }
  });

  for (let d = 1; d <= total; d++) {
    const jsDay = new Date(year, month, d).getDay();
    const weekend = jsDay === 0 || jsDay === 6;
    const isFuture = new Date(year, month, d) > today;

    const log = logMap.get(d);
    if (log) {
      result.push({
        date: d,
        status: mapStatus(log.attendanceStatus?.name),
        checkIn: log.checkIn || undefined,
        checkOut: log.checkOut || undefined,
        hours: log.workTime ? `${Math.floor(log.workTime / 60)}h ${log.workTime % 60}m` : undefined,
        note: log.note || undefined,
      });
    } else if (weekend) {
      result.push({ date: d, status: 'weekend' });
    } else if (isFuture) {
      result.push({ date: d, status: 'absent' });
    } else {
      result.push({ date: d, status: 'absent', note: 'No record' });
    }
  }
  return result;
}

// ─── Status helpers ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    icon: string;
    iconFamily: 'ionicons' | 'material';
    color: string;
    bg: string;
    border: string;
  }
> = {
  present: {
    label: 'Present',
    icon: 'checkmark',
    iconFamily: 'ionicons',
    color: '#2ecc71',
    bg: '#0d2818',
    border: '#1a4d2e',
  },
  late: {
    label: 'Late',
    icon: 'time-outline',
    iconFamily: 'ionicons',
    color: '#f1c40f',
    bg: '#1f1a00',
    border: '#4a3f00',
  },
  absent: {
    label: 'Absent',
    icon: 'close',
    iconFamily: 'ionicons',
    color: '#e74c3c',
    bg: '#200808',
    border: '#4a1010',
  },
  sick: {
    label: 'Sick Leave',
    icon: 'thermometer',
    iconFamily: 'material',
    color: '#e67e22',
    bg: '#1f0f00',
    border: '#4a2500',
  },
  annual: {
    label: 'Annual Leave',
    icon: 'airplane-outline',
    iconFamily: 'ionicons',
    color: '#3498db',
    bg: '#001020',
    border: '#003050',
  },
  latepenalty: {
    label: 'Late Penalty',
    icon: 'alert-circle-outline',
    iconFamily: 'ionicons',
    color: '#e67e22',
    bg: '#1f0a00',
    border: '#4a1a00',
  },
  holiday: {
    label: 'Holiday',
    icon: 'sunny-outline',
    iconFamily: 'ionicons',
    color: '#9b59b6',
    bg: '#150020',
    border: '#350050',
  },
  weekend: {
    label: 'Weekend',
    icon: 'moon-outline',
    iconFamily: 'ionicons',
    color: '#444444',
    bg: '#0a0a0a',
    border: '#1a1a1a',
  },
};

function StatusIcon({ status, size = 16 }: { status: AttendanceStatus; size?: number }) {
  const cfg = STATUS_CONFIG[status];
  if (cfg.iconFamily === 'material') {
    return <MaterialCommunityIcons name={cfg.icon as any} size={size} color={cfg.color} />;
  }
  return <Ionicons name={cfg.icon as any} size={size} color={cfg.color} />;
}

// ─── DonutChart ───────────────────────────────────────────────────────────────
function DonutChart({ percentage }: { percentage: number }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 10,
        borderColor: '#e74c3c',
      }}>
      <Text className="text-white text-2xl font-black">{percentage}%</Text>
      <Text className="text-[#888888] text-[11px] font-semibold">Present</Text>
    </View>
  );
}

// ─── MiniDonut ────────────────────────────────────────────────────────────────
function MiniDonut({ taken, total, color }: { taken: number; total: number; color: string }) {
  return (
    <View
      className="items-center justify-center shrink-0"
      style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 4, borderColor: color }}>
      <Text className="text-white text-[10px] font-black">
        {taken}/{total}
      </Text>
    </View>
  );
}

// ─── LeaveStatRow ─────────────────────────────────────────────────────────────
function LeaveStatRow({
  label,
  value,
  dotColor,
}: {
  label: string;
  value: number;
  dotColor: string;
}) {
  return (
    <View className="flex-row items-center mb-0.5">
      <Text className="text-[#666666] text-[10px] font-semibold w-16">{label}:</Text>
      <Text style={{ color: dotColor }} className="text-[10px] font-bold">
        {String(value).padStart(2, '0')}
      </Text>
      <View
        className="rounded-full ml-1"
        style={{ width: 6, height: 6, backgroundColor: dotColor }}
      />
    </View>
  );
}

// ─── StatBox ──────────────────────────────────────────────────────────────────
function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <View className="flex-1 bg-[#111111] border border-[#1e1e1e] rounded-xl p-3 items-center overflow-hidden">
      <View className="mb-1">{icon}</View>
      <Text className="text-[#666666] text-[10px] font-semibold text-center mb-1" numberOfLines={2}>
        {label}
      </Text>
      <Text className="text-white text-2xl font-black">{String(value)}</Text>
    </View>
  );
}

// ─── Day Column (one cell in the timeline) ────────────────────────────────────
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

// ─── Detail Sheet Modal ───────────────────────────────────────────────────────
function DayDetailSheet({
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

// ─── Horizontal Timeline Calendar ────────────────────────────────────────────
function TimelineCalendar({
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
          {(['present', 'late', 'absent', 'sick', 'annual', 'weekend'] as AttendanceStatus[]).map(
            s => (
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
            ),
          )}
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
        {/* ── Profile Bar ────────────────────────────────────────────────── */}
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
              Software Engineer
            </Text>
          </View>
        </View>

        {/* ── Attendance Overview Card ────────────────────────────────────── */}
        <View className="bg- [#111111] border border-[#1e1e1e] rounded-2xl p-4 mb-4">
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
          <View className="flex-row items-center justify-between mb-5  bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
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
            <View className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-2 py-">
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
            icon={<Ionicons name="time-outline" size={16} color="#f1c40f" />}
            label="Late"
            value={stats.late}
          />
          <StatBox
            icon={<Ionicons name="alert-circle-outline" size={16} color="#e67e22" />}
            label={'Late With\nPenalty'}
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

      {/* ── Date Picker Modal ──────────────────────────────────────────────── */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
        statusBarTranslucent={true}>
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
          <View className="w-full bg-[#161616] border border-[#2a2a2a] rounded-[20px] p-5">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-white text-lg font-extrabold">Select Date</Text>
              <Pressable
                onPress={() => setShowDatePicker(false)}
                className="w-8 h-8 rounded-full bg-[#222222] items-center justify-center">
                <Ionicons name="close" size={18} color="#888888" />
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between bg-[#1e1e1e] rounded-xl px-3 py-2.5 mb-5">
              <Pressable
                onPress={() => setPickerYear(y => y - 1)}
                className="w-8 h-8 rounded-full bg-[#2a2a2a] items-center justify-center">
                <Ionicons name="chevron-back" size={18} color="#888888" />
              </Pressable>
              <Text className="text-white font-extrabold text-[17px]">{pickerYear}</Text>
              <Pressable
                onPress={() => setPickerYear(y => y + 1)}
                className="w-8 h-8 rounded-full bg-[#2a2a2a] items-center justify-center">
                <Ionicons name="chevron-forward" size={18} color="#888888" />
              </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {MONTHS.map((m, i) => {
                const isSelected = i === selectedMonth && pickerYear === selectedYear;
                return (
                  <Pressable
                    key={m}
                    onPress={() => confirmPicker(i)}
                    className={`items-center justify-center rounded-xl py-3.5 ${isSelected ? 'bg-white' : 'bg-[#1e1e1e]'}`}
                    style={{ width: '30%' }}>
                    <Text
                      className={`text-sm font-semibold ${isSelected ? 'text-black font-extrabold' : 'text-[#aaaaaa]'}`}>
                      {m}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
