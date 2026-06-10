import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EmployeeDashboardScreen } from '../screens/EmployeeDashboardScreen';
import { EmployeeHistoryScreen } from '../screens/EmployeeHistoryScreen';
import { colors, typography } from '@attendance/ui';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export const EmployeeNavigator: React.FC = () => {
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
        name="EmployeeDashboard"
        component={EmployeeDashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock-check-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EmployeeHistory"
        component={EmployeeHistoryScreen}
        options={{
          title: 'Logs History',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
