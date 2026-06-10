import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/DashboardScreen';
import { EmployeeStack } from './EmployeeStack';
import { AttendanceStack } from './AttendanceStack';
import { colors, typography } from '@attendance/ui';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          ...typography.small,
          marginBottom: Platform.OS === 'ios' ? 0 : 6,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingTop: 8,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: true,
          headerTitle: 'Dashboard',
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { ...typography.h2, color: colors.text },
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EmployeesTab"
        component={EmployeeStack}
        options={{
          title: 'Employees',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AttendanceTab"
        component={AttendanceStack}
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-check-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
