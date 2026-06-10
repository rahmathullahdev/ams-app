import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, StatCard, AppButton } from '@attendance/ui';
import { useDashboardStats } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';
import { LoadingSpinner } from '@attendance/ui';
import { getGreeting, getTodayDateString } from '../utils/formatters';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const { data: stats, isLoading, refetch, isRefetching } = useDashboardStats();
  const { data: employees } = useEmployees();

  if (isLoading) return <LoadingSpinner />;

  const recentEmployees = employees?.slice(0, 5) || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
    >
      {/* Greeting Header */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.dateText}>{getTodayDateString()}</Text>
          </View>
          <TouchableOpacity style={styles.adminLogoutButton} onPress={logout}>
            <MaterialCommunityIcons name="logout" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Grid */}
      <Text style={styles.sectionTitle}>Today's Overview</Text>
      <View style={styles.statsGrid}>
        <StatCard
          icon={<MaterialCommunityIcons name="account-group" size={22} color={colors.primary} />}
          label="Total Employees"
          value={stats?.totalEmployees ?? 0}
          color={colors.primary}
          bgColor={colors.primaryBg}
          style={{ marginRight: spacing.md }}
        />
        <StatCard
          icon={<MaterialCommunityIcons name="check-circle" size={22} color={colors.success} />}
          label="Present Today"
          value={stats?.presentToday ?? 0}
          color={colors.success}
          bgColor={colors.successBg}
        />
      </View>
      <View style={[styles.statsGrid, { marginTop: spacing.md }]}>
        <StatCard
          icon={<MaterialCommunityIcons name="close-circle" size={22} color={colors.danger} />}
          label="Absent Today"
          value={stats?.absentToday ?? 0}
          color={colors.danger}
          bgColor={colors.dangerBg}
          style={{ marginRight: spacing.md }}
        />
        <StatCard
          icon={<MaterialCommunityIcons name="chart-arc" size={22} color={colors.warning} />}
          label="Attendance %"
          value={`${stats?.attendancePercentage ?? 0}%`}
          color={colors.warning}
          bgColor={colors.warningBg}
        />
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { marginTop: spacing['3xl'] }]}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <AppButton
            title="View Logs"
            onPress={() => navigation.navigate('AttendanceTab', {
              screen: 'AttendanceDashboard',
              params: {},
            })}
            variant="primary"
            fullWidth
            icon={<MaterialCommunityIcons name="file-document-outline" size={18} color="#FFF" />}
          />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <AppButton
            title="Add Employee"
            onPress={() => navigation.navigate('EmployeesTab', {
              screen: 'AddEmployee',
            })}
            variant="outline"
            fullWidth
            icon={<MaterialCommunityIcons name="account-plus" size={18} color={colors.primary} />}
          />
        </View>
      </View>

      {/* Recent Employees */}
      <Text style={[styles.sectionTitle, { marginTop: spacing['3xl'] }]}>Recent Employees</Text>
      <View style={[styles.recentCard, shadows.card]}>
        {recentEmployees.length === 0 ? (
          <Text style={styles.emptyText}>No employees added yet</Text>
        ) : (
          recentEmployees.map((emp, index) => (
            <View key={emp.id}>
              <View style={styles.recentItem}>
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(emp.name) }]}>
                  <Text style={styles.avatarText}>
                    {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{emp.name}</Text>
                  <Text style={styles.recentDept}>{emp.department}</Text>
                </View>
                <View style={styles.empIdBadge}>
                  <Text style={styles.empIdText}>#{emp.employeeId}</Text>
                </View>
              </View>
              {index < recentEmployees.length - 1 && <View style={styles.divider} />}
            </View>
          ))
        )}
      </View>

      <View style={{ height: spacing['3xl'] }} />
    </ScrollView>
  );
};

const avatarColors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const getAvatarColor = (name: string): string => {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[index];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  greetingCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminLogoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    ...typography.h2,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
  },
  actionsRow: {
    flexDirection: 'row',
  },
  recentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
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
  recentInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  recentName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  recentDept: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  empIdBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  empIdText: {
    ...typography.small,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
