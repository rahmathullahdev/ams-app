import { attendanceRepository } from '../repositories/attendance.repository';
import { employeeRepository } from '../repositories/employee.repository';
import { CheckInInput, CheckOutInput, AttendanceSummary } from '@attendance/shared-types';
import { AttendanceStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

export class AttendanceService {
  async checkIn(data: CheckInInput) {
    // Verify employee exists
    const employee = await employeeRepository.findById(data.employeeId);
    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await attendanceRepository.findByEmployeeAndDate(data.employeeId, today);
    if (existing) {
      throw ApiError.conflict('Employee has already checked in today');
    }

    const status = (data.status as AttendanceStatus) || 'PRESENT';
    return attendanceRepository.createCheckIn(data.employeeId, today, new Date(), status);
  }

  async checkOut(data: CheckOutInput) {
    const employee = await employeeRepository.findById(data.employeeId);
    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await attendanceRepository.findByEmployeeAndDate(data.employeeId, today);
    if (!attendance) {
      throw ApiError.badRequest('Employee has not checked in today');
    }

    if (attendance.checkOut) {
      throw ApiError.conflict('Employee has already checked out today');
    }

    return attendanceRepository.updateCheckOut(attendance.id, new Date());
  }

  async getAttendanceHistory(employeeId: string, from?: string, to?: string) {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    return attendanceRepository.findByEmployee(employeeId, fromDate, toDate);
  }

  async getMonthlyAttendanceSummary(employeeId: string, year?: number, month?: number): Promise<AttendanceSummary> {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }

    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    const stats = await attendanceRepository.getMonthlyStats(employeeId, targetYear, targetMonth);

    // Calculate days in month
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();

    let presentDays = 0;
    let absentDays = 0;
    let halfDays = 0;

    stats.forEach((stat) => {
      switch (stat.status) {
        case 'PRESENT':
          presentDays = stat._count.status;
          break;
        case 'ABSENT':
          absentDays = stat._count.status;
          break;
        case 'HALF_DAY':
          halfDays = stat._count.status;
          break;
      }
    });

    const totalRecorded = presentDays + absentDays + halfDays;
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    return {
      month: monthNames[targetMonth - 1],
      year: targetYear,
      totalDays: totalRecorded,
      presentDays,
      absentDays,
      halfDays,
      attendancePercentage: totalRecorded > 0
        ? Math.round(((presentDays + halfDays * 0.5) / totalRecorded) * 100)
        : 0,
    };
  }

  async getDashboardStats() {
    return attendanceRepository.getTodayStats();
  }
}

export const attendanceService = new AttendanceService();
