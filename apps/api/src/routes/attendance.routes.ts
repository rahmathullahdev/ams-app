import { Router } from 'express';
import { attendanceController } from '../controllers/attendance.controller';
import { validateRequest } from '../middleware/validateRequest';
import { CheckInSchema, CheckOutSchema } from '@attendance/shared-types';

const router = Router();

// Dashboard stats — must be before /:employeeId to avoid route conflicts
router.get('/today/stats', attendanceController.getDashboardStats);

// Check-in / Check-out
router.post('/checkin', validateRequest(CheckInSchema), attendanceController.checkIn);
router.post('/checkout', validateRequest(CheckOutSchema), attendanceController.checkOut);

// History & Summary
router.get('/summary/:employeeId', attendanceController.getSummary);
router.get('/:employeeId', attendanceController.getHistory);

export default router;
