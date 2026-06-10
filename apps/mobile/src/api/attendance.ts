import { apiClient } from './client';
import {
  Attendance,
  AttendanceSummary,
  DashboardStats,
  CheckInInput,
  CheckOutInput,
  ApiResponse,
} from '@attendance/shared-types';

export const attendanceApi = {
  checkIn: async (input: CheckInInput): Promise<Attendance> => {
    const { data } = await apiClient.post<ApiResponse<Attendance>>('/attendance/checkin', input);
    return data.data;
  },

  checkOut: async (input: CheckOutInput): Promise<Attendance> => {
    const { data } = await apiClient.post<ApiResponse<Attendance>>('/attendance/checkout', input);
    return data.data;
  },

  getHistory: async (employeeId: string, from?: string, to?: string): Promise<Attendance[]> => {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const { data } = await apiClient.get<ApiResponse<Attendance[]>>(
      `/attendance/${employeeId}`,
      { params }
    );
    return data.data;
  },

  getSummary: async (
    employeeId: string,
    year?: number,
    month?: number
  ): Promise<AttendanceSummary> => {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const { data } = await apiClient.get<ApiResponse<AttendanceSummary>>(
      `/attendance/summary/${employeeId}`,
      { params }
    );
    return data.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/attendance/today/stats');
    return data.data;
  },
};
