import { z } from 'zod';

import { Attendance } from './attendance';

// ─── Employee Schemas ────────────────────────────────────────────────

export const CreateEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  password: z.string().optional(),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export const LoginEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;
export type LoginEmployeeInput = z.infer<typeof LoginEmployeeSchema>;

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  attendances?: Attendance[];
}

