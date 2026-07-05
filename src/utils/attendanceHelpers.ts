import { BackendAttendance } from '../types/attendance';
import { AttendanceStatus, DayAttendance } from '../constants/attendanceConstants';

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getJsDay(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

export const mapStatus = (name?: string): AttendanceStatus => {
  if (!name) return 'absent';
  const lower = name.toLowerCase();
  if (lower.includes('present') || lower.includes('on time') || lower.includes('half day'))
    return 'present';
  if (lower.includes('penalty')) return 'latepenalty';
  if (lower.includes('late')) return 'late';
  if (lower.includes('absent')) return 'absent';
  if (lower.includes('sick')) return 'sick';
  if (lower.includes('annual')) return 'annual';
  if (lower.includes('holiday')) return 'holiday';
  if (lower.includes('weekend')) return 'weekend';
  return 'absent';
};

export function buildAttendanceDataFromBackend(
  year: number,
  month: number,
  backendLogs: BackendAttendance[],
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
        checkIn: log.startTime || undefined,
        checkOut: log.endTime || undefined,
        hours: undefined,
        note: log.note || undefined,
      });
    } else if (weekend) {
      result.push({ date: d, status: 'weekend' });
    } else if (isFuture) {
      result.push({ date: d, status: 'none' });
    } else {
      result.push({ date: d, status: 'none', note: 'No record' });
    }
  }
  return result;
}
