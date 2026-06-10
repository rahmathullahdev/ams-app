import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance';
import { CheckInInput, CheckOutInput } from '@attendance/shared-types';
import { Alert } from 'react-native';

const ATTENDANCE_KEY = ['attendance'];
const DASHBOARD_KEY = ['dashboard-stats'];

export const useDashboardStats = () => {
  return useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: () => attendanceApi.getDashboardStats(),
    refetchInterval: 30000, // Auto-refresh every 30s
  });
};

export const useAttendanceHistory = (employeeId: string, from?: string, to?: string) => {
  return useQuery({
    queryKey: [...ATTENDANCE_KEY, employeeId, from, to],
    queryFn: () => attendanceApi.getHistory(employeeId, from, to),
    enabled: !!employeeId,
  });
};

export const useAttendanceSummary = (employeeId: string, year?: number, month?: number) => {
  return useQuery({
    queryKey: [...ATTENDANCE_KEY, 'summary', employeeId, year, month],
    queryFn: () => attendanceApi.getSummary(employeeId, year, month),
    enabled: !!employeeId,
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CheckInInput) => attendanceApi.checkIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CheckOutInput) => attendanceApi.checkOut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });
};
