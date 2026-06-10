import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, LoadingSpinner, EmptyState } from '@attendance/ui';
import { useEmployees } from '../hooks/useEmployees';
import { useDashboardStats } from '../hooks/useAttendance';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AttendanceStackParamList } from '../navigation/AttendanceStack';
import { useNavigation } from '@react-navigation/native';
import { Employee } from '@attendance/shared-types';
import { getTodayDateString, formatTime } from '../utils/formatters';

type NavigationProp = NativeStackNavigationProp<AttendanceStackParamList, 'AttendanceDashboard'>;

export const AttendanceDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data: employees, isLoading, refetch, isRefetching } = useEmployees();
  const { data: stats } = useDashboardStats();

  if (isLoading) return <LoadingSpinner />;

  const getTodayStatusText = (emp: Employee) => {
    if (!emp.attendances || emp.attendances.length === 0) return 'Not Checked In';
    const latest = emp.attendances[0];
    const recordDate = new Date(latest.attendanceDate);
    const today = new Date();
    
    if (
      recordDate.getFullYear() === today.getFullYear() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getDate() === today.getDate()
    ) {
      if (latest.checkIn && !latest.checkOut) {
        return `In: ${formatTime(latest.checkIn)}`;
      }
      if (latest.checkIn && latest.checkOut) {
        return `Out: ${formatTime(latest.checkOut)}`;
      }
    }
    return 'Not Checked In';
  };

  const getStatusColor = (emp: Employee) => {
    if (!emp.attendances || emp.attendances.length === 0) return colors.textTertiary;
    const latest = emp.attendances[0];
    const recordDate = new Date(latest.attendanceDate);
    const today = new Date();
    
    if (
      recordDate.getFullYear() === today.getFullYear() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getDate() === today.getDate()
    ) {
      if (latest.checkIn && !latest.checkOut) {
        return colors.success;
      }
      if (latest.checkIn && latest.checkOut) {
        return colors.textSecondary;
      }
    }
    return colors.textTertiary;
  };

  const renderEmployeeItem = ({ item }: { item: Employee }) => {
    const initials = item.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const avatarColors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const colorIndex = item.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length;

    const statusText = getTodayStatusText(item);
    const statusColor = getStatusColor(item);

    return (
      <TouchableOpacity
        style={[styles.employeeRow, shadows.sm]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('AttendanceHistory', {
          employeeId: item.id,
          employeeName: item.name,
        })}
      >
        <View style={[styles.avatar, { backgroundColor: avatarColors[colorIndex] }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.name}</Text>
          <Text style={styles.employeeDept}>{item.department}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Today's Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.dateLabel}>{getTodayDateString()}</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{stats?.presentToday ?? 0}</Text>
            <Text style={styles.summaryLabel}>Present</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.danger }]}>{stats?.absentToday ?? 0}</Text>
            <Text style={styles.summaryLabel}>Absent</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{stats?.attendancePercentage ?? 0}%</Text>
            <Text style={styles.summaryLabel}>Rate</Text>
          </View>
        </View>
      </View>

      {/* Employee List */}
      <Text style={styles.sectionTitle}>Employees</Text>
      <FlatList
        data={employees}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<MaterialCommunityIcons name="clipboard-text-off" size={36} color={colors.primary} />}
            title="No Employees"
            message="Add employees first to manage attendance"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  dateLabel: {
    ...typography.captionMedium,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h1,
    color: '#FFFFFF',
  },
  summaryLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginLeft: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
    flexGrow: 1,
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  employeeInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  employeeName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  employeeDept: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  markButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.captionMedium,
    fontWeight: '600',
  },
});
