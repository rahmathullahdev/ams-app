import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmployeeListScreen } from '../screens/EmployeeListScreen';
import { EmployeeDetailScreen } from '../screens/EmployeeDetailScreen';
import { AddEmployeeScreen } from '../screens/AddEmployeeScreen';
import { EditEmployeeScreen } from '../screens/EditEmployeeScreen';
import { colors, typography } from '@attendance/ui';

export type EmployeeStackParamList = {
  EmployeeList: undefined;
  EmployeeDetail: { id: string };
  AddEmployee: undefined;
  EditEmployee: { id: string };
};

const Stack = createNativeStackNavigator<EmployeeStackParamList>();

export const EmployeeStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { ...typography.h3, color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="EmployeeList"
        component={EmployeeListScreen}
        options={{ title: 'Employees' }}
      />
      <Stack.Screen
        name="EmployeeDetail"
        component={EmployeeDetailScreen}
        options={{ title: 'Employee Details' }}
      />
      <Stack.Screen
        name="AddEmployee"
        component={AddEmployeeScreen}
        options={{ title: 'Add Employee', presentation: 'modal' }}
      />
      <Stack.Screen
        name="EditEmployee"
        component={EditEmployeeScreen}
        options={{ title: 'Edit Employee', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};
