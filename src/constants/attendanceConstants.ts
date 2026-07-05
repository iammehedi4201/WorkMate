export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'sick'
  | 'annual'
  | 'latepenalty'
  | 'holiday'
  | 'weekend'
  | 'none';

export interface DayAttendance {
  date: number; // 1-31
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  hours?: string;
  overtime?: string;
  note?: string;
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MONTH_NAMES_LONG = [
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

export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Fixed column width for each day in the timeline
export const DAY_COL_WIDTH = 58;

export const STATUS_CONFIG: Record<
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
  none: {
    label: 'None',
    icon: 'remove',
    iconFamily: 'ionicons',
    color: '#555555',
    bg: '#111111',
    border: '#222222',
  },
  late: {
    label: 'Late',
    icon: 'time-outline',
    iconFamily: 'ionicons',
    color: '#e67e22',
    bg: '#1f1300',
    border: '#4a2d00',
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
    icon: 'warning-outline',
    iconFamily: 'ionicons',
    color: '#e67e22',
    bg: '#1f1300',
    border: '#4a2d00',
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
