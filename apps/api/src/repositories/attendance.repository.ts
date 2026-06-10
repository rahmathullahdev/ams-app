import prisma from '../prisma/client';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceRepository {
  async findByEmployeeAndDate(employeeId: string, date: Date) {
    return prisma.attendance.findUnique({
      where: {
        employeeId_attendanceDate: {
          employeeId,
          attendanceDate: date,
        },
      },
    });
  }

  async createCheckIn(employeeId: string, date: Date, checkIn: Date, status: AttendanceStatus) {
    return prisma.attendance.create({
      data: {
        employeeId,
        attendanceDate: date,
        checkIn,
        status,
      },
      include: {
        employee: {
          select: { id: true, name: true, employeeId: true, department: true },
        },
      },
    });
  }

  async updateCheckOut(id: string, checkOut: Date) {
    return prisma.attendance.update({
      where: { id },
      data: { checkOut },
      include: {
        employee: {
          select: { id: true, name: true, employeeId: true, department: true },
        },
      },
    });
  }

  async findByEmployee(employeeId: string, from?: Date, to?: Date) {
    const where: any = { employeeId };

    if (from || to) {
      where.attendanceDate = {};
      if (from) where.attendanceDate.gte = from;
      if (to) where.attendanceDate.lte = to;
    }

    return prisma.attendance.findMany({
      where,
      orderBy: { attendanceDate: 'desc' },
      include: {
        employee: {
          select: { id: true, name: true, employeeId: true, department: true },
        },
      },
    });
  }

  async getMonthlyStats(employeeId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    return prisma.attendance.groupBy({
      by: ['status'],
      where: {
        employeeId,
        attendanceDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: { status: true },
    });
  }

  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEmployees = await prisma.employee.count();

    const todayAttendance = await prisma.attendance.findMany({
      where: {
        attendanceDate: today,
      },
    });

    const presentToday = todayAttendance.filter(
      (a) => a.status === 'PRESENT' || a.status === 'HALF_DAY'
    ).length;

    const absentToday = totalEmployees - presentToday;

    return {
      totalEmployees,
      presentToday,
      absentToday,
      attendancePercentage: totalEmployees > 0
        ? Math.round((presentToday / totalEmployees) * 100)
        : 0,
    };
  }
}

export const attendanceRepository = new AttendanceRepository();
