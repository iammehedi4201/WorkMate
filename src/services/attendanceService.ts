import { apiClient } from './apiClient';
import { MonthlyAttendanceResponse } from '../types/attendance';

export const attendanceService = {
  /**
   * Get employee's monthly attendance logs.
   */
  async getMyMonthlyAttendance(startDate: string, endDate: string): Promise<MonthlyAttendanceResponse> {
    const response = await apiClient.get<MonthlyAttendanceResponse>(
      `/employee/gamma/hr/attendanceModule/attendanceUnit/attendances/getMyMonthlyAttendance/${startDate}/${endDate}`
    );
    return response.data;
  },
};
