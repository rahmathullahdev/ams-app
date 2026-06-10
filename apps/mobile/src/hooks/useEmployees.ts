import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../api/employees';
import { CreateEmployeeInput, UpdateEmployeeInput } from '@attendance/shared-types';
import { Alert } from 'react-native';

const EMPLOYEES_KEY = ['employees'];

export const useEmployees = (search?: string) => {
  return useQuery({
    queryKey: [...EMPLOYEES_KEY, search],
    queryFn: () => employeeApi.getAll(search),
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: [...EMPLOYEES_KEY, id],
    queryFn: () => employeeApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeeInput) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeInput }) =>
      employeeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });
};
