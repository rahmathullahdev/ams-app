import { Request, Response } from 'express';
import { employeeService } from '../services/employee.service';
import { asyncHandler } from '../utils/asyncHandler';

export class EmployeeController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const employees = await employeeService.getAllEmployees(search);
    res.json({ success: true, data: employees });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { employeeId, password } = req.body;
    const employee = await employeeService.loginEmployee(employeeId, password);
    res.json({ success: true, data: employee, message: 'Authenticated successfully' });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const employee = await employeeService.getEmployeeById(req.params.id as string);
    res.json({ success: true, data: employee });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ success: true, data: employee, message: 'Employee created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const employee = await employeeService.updateEmployee(req.params.id as string, req.body);
    res.json({ success: true, data: employee, message: 'Employee updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await employeeService.deleteEmployee(req.params.id as string);
    res.json({ success: true, data: null, message: 'Employee deleted successfully' });
  });
}

export const employeeController = new EmployeeController();
