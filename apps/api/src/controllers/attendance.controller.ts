import { Request, Response } from 'express';
import { attendanceService } from '../services/attendance.service';
import { asyncHandler } from '../utils/asyncHandler';

export class AttendanceController {
  checkIn = asyncHandler(async (req: Request, res: Response) => {
    const attendance = await attendanceService.checkIn(req.body);
    res.status(201).json({
      success: true,
      data: attendance,
      message: 'Check-in recorded successfully',
    });
  });

  checkOut = asyncHandler(async (req: Request, res: Response) => {
    const attendance = await attendanceService.checkOut(req.body);
    res.json({
      success: true,
      data: attendance,
      message: 'Check-out recorded successfully',
    });
  });

  getHistory = asyncHandler(async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId as string;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const attendance = await attendanceService.getAttendanceHistory(employeeId, from, to);
    res.json({ success: true, data: attendance });
  });

  getSummary = asyncHandler(async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId as string;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const summary = await attendanceService.getMonthlyAttendanceSummary(employeeId, year, month);
    res.json({ success: true, data: summary });
  });

  getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await attendanceService.getDashboardStats();
    res.json({ success: true, data: stats });
  });
}

export const attendanceController = new AttendanceController();
