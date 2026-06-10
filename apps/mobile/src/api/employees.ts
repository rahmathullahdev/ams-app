import { apiClient } from './client';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput, ApiResponse } from '@attendance/shared-types';

export const employeeApi = {
  getAll: async (search?: string): Promise<Employee[]> => {
    const params = search ? { search } : {};
    const { data } = await apiClient.get<ApiResponse<Employee[]>>('/employees', { params });
    return data.data;
  },

  login: async (employeeId: string, password?: string): Promise<Employee> => {
    const { data } = await apiClient.post<ApiResponse<Employee>>('/employees/login', { employeeId, password });
    return data.data;
  },

  getById: async (id: string): Promise<Employee> => {
    const { data } = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
    return data.data;
  },

  create: async (input: CreateEmployeeInput): Promise<Employee> => {
    const { data } = await apiClient.post<ApiResponse<Employee>>('/employees', input);
    return data.data;
  },

  update: async (id: string, input: UpdateEmployeeInput): Promise<Employee> => {
    const { data } = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, input);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },
};
