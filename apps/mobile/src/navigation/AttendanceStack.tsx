import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AttendanceDashboardScreen } from '../screens/AttendanceDashboardScreen';
import { MarkAttendanceScreen } from '../screens/MarkAttendanceScreen';
import { AttendanceHistoryScreen } from '../screens/AttendanceHistoryScreen';
import { colors, typography } from '@attendance/ui';

export type AttendanceStackParamList = {
  AttendanceDashboard: undefined;
  MarkAttendance: { employeeId?: string; employeeName?: string };
  AttendanceHistory: { employeeId: string; employeeName: string };
};

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

export const AttendanceStack: React.FC = () => {
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
        name="AttendanceDashboard"
        component={AttendanceDashboardScreen}
        options={{ title: 'Attendance' }}
      />
      <Stack.Screen
        name="MarkAttendance"
        component={MarkAttendanceScreen}
        options={{ title: 'Mark Attendance', presentation: 'modal' }}
      />
      <Stack.Screen
        name="AttendanceHistory"
        component={AttendanceHistoryScreen}
        options={{ title: 'History' }}
      />
    </Stack.Navigator>
  );
};
