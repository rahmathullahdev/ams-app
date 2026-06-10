import { z } from 'zod';

// ─── Attendance Schemas ──────────────────────────────────────────────

export const AttendanceStatusEnum = z.enum(['PRESENT', 'ABSENT', 'HALF_DAY']);
export type AttendanceStatus = z.infer<typeof AttendanceStatusEnum>;

export const CheckInSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  status: AttendanceStatusEnum.optional().default('PRESENT'),
});

export const CheckOutSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
});

export const AttendanceFilterSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: AttendanceStatusEnum.optional(),
});

export type CheckInInput = z.infer<typeof CheckInSchema>;
export type CheckOutInput = z.infer<typeof CheckOutSchema>;
export type AttendanceFilter = z.infer<typeof AttendanceFilterSchema>;

export interface Attendance {
  id: string;
  employeeId: string;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    name: string;
    employeeId: string;
    department: string;
  };
}

export interface AttendanceSummary {
  month: string;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  attendancePercentage: number;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  attendancePercentage: number;
}
