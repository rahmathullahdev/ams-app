import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee } from '@attendance/shared-types';
import { employeeApi } from '../api/employees';

export type UserSession =
  | { role: 'admin' }
  | { role: 'employee'; employee: Employee };

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  loginAsAdmin: (email: string, passcode: string) => Promise<void>;
  loginAsEmployee: (employeeId: string, password?: string) => Promise<void>;
  logout: () => void;
  refreshEmployeeData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial load checks if mock session was active
    setIsLoading(false);
  }, []);

  const loginAsAdmin = async (email: string, passcode: string) => {
    setIsLoading(true);
    try {
      // Basic check for admin credentials
      if (email.toLowerCase().trim() === 'admin@company.com' && passcode === 'admin123') {
        setUser({ role: 'admin' });
      } else {
        throw new Error('Invalid Admin email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsEmployee = async (employeeId: string, password?: string) => {
    setIsLoading(true);
    try {
      if (!employeeId.trim()) {
        throw new Error('Employee ID is required.');
      }
      if (!password?.trim()) {
        throw new Error('Password is required.');
      }

      // Authenticate employee against backend database
      const matched = await employeeApi.login(employeeId.trim(), password);
      setUser({ role: 'employee', employee: matched });
    } catch (err: any) {
      // Extract clean error message if available
      const message = err.response?.data?.message || err.message || 'Authentication failed.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const refreshEmployeeData = async () => {
    if (user && user.role === 'employee') {
      try {
        const updatedEmployee = await employeeApi.getById(user.employee.id);
        if (updatedEmployee) {
          setUser({ role: 'employee', employee: updatedEmployee });
        }
      } catch (e) {
        console.warn('Failed to refresh employee data', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginAsAdmin,
        loginAsEmployee,
        logout,
        refreshEmployeeData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
