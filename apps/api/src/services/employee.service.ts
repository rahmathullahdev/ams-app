import { employeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeInput, UpdateEmployeeInput } from '@attendance/shared-types';
import { ApiError } from '../utils/ApiError';

export class EmployeeService {
  async getAllEmployees(search?: string) {
    return employeeRepository.findAll(search);
  }

  async loginEmployee(employeeId: string, password?: string) {
    if (!employeeId || !password) {
      throw ApiError.badRequest('Employee ID and password are required');
    }
    const employee = await employeeRepository.findByEmployeeId(employeeId);
    if (!employee || employee.password !== password) {
      throw ApiError.unauthorized('Invalid Employee ID or password');
    }
    return employee;
  }

  async getEmployeeById(id: string) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw ApiError.notFound('Employee not found');
    }
    return employee;
  }

  async createEmployee(data: CreateEmployeeInput) {
    // Check if employeeId already exists
    const existing = await employeeRepository.findByEmployeeId(data.employeeId);
    if (existing) {
      throw ApiError.conflict(`Employee with ID ${data.employeeId} already exists`);
    }
    return employeeRepository.create(data);
  }

  async updateEmployee(id: string, data: UpdateEmployeeInput) {
    // Verify employee exists
    const existing = await employeeRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Employee not found');
    }

    // Check for employeeId uniqueness if being updated
    if (data.employeeId && data.employeeId !== existing.employeeId) {
      const duplicate = await employeeRepository.findByEmployeeId(data.employeeId);
      if (duplicate) {
        throw ApiError.conflict(`Employee with ID ${data.employeeId} already exists`);
      }
    }

    return employeeRepository.update(id, data);
  }

  async deleteEmployee(id: string) {
    const existing = await employeeRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Employee not found');
    }
    return employeeRepository.delete(id);
  }
}

export const employeeService = new EmployeeService();
