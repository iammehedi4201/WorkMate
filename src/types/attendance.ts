export interface AttendanceStatus {
  _id: string;
  name: string;
  color?: string;
}

export interface BackendAttendance {
  _id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workTime?: number;
  attendanceStatus?: AttendanceStatus;
  note?: string;
}

export interface MonthlyAttendanceResponse {
  attendances: BackendAttendance[];
  leaves: {
    recLeaves: number;
    sickLeaves: number;
    totalRecreationLeaveTaken: number;
    totalSicksLeaveTaken: number;
  };
  totalWorkingDaysStatus: {
    totalLateDays: number;
    totalAbsentDays: number;
    totalPresentDays: number;
    totalHalfDayPresentDays: number;
  };
}
