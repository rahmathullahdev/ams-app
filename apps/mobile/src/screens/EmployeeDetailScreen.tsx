import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, AppButton, LoadingSpinner } from '@attendance/ui';
import { useEmployee, useDeleteEmployee } from '../hooks/useEmployees';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmployeeStackParamList } from '../navigation/EmployeeStack';
import { formatDate, formatTime } from '../utils/formatters';

type Props = NativeStackScreenProps<EmployeeStackParamList, 'EmployeeDetail'>;

export const EmployeeDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { data: employee, isLoading } = useEmployee(id);
  const deleteEmployee = useDeleteEmployee();

  if (isLoading || !employee) return <LoadingSpinner />;

  const handleDelete = () => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.name}? This will also delete all their attendance records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteEmployee.mutateAsync(id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const avatarColors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
  const colorIndex = employee.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length;

  const infoRows = [
    { icon: 'badge-account-horizontal-outline' as const, label: 'Employee ID', value: employee.employeeId },
    { icon: 'email-outline' as const, label: 'Email', value: employee.email },
    { icon: 'phone-outline' as const, label: 'Phone', value: employee.phone },
    { icon: 'domain' as const, label: 'Department', value: employee.department },
    { icon: 'briefcase-outline' as const, label: 'Designation', value: employee.designation },
    { icon: 'calendar-outline' as const, label: 'Joined', value: formatDate(employee.createdAt) },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={[styles.profileCard, shadows.card]}>
        <View style={[styles.avatar, { backgroundColor: avatarColors[colorIndex] }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.designation}>{employee.designation}</Text>
        <View style={styles.deptBadge}>
          <Text style={styles.deptText}>{employee.department}</Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={[styles.infoCard, shadows.card]}>
        <Text style={styles.sectionTitle}>Details</Text>
        {infoRows.map((row, index) => (
          <View key={row.label}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <MaterialCommunityIcons name={row.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            </View>
            {index < infoRows.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Attendance Logs Card */}
      <View style={[styles.infoCard, shadows.card]}>
        <Text style={styles.sectionTitle}>Recent Check-Ins & Check-Outs</Text>
        {!employee.attendances || employee.attendances.length === 0 ? (
          <Text style={styles.emptyText}>No check-in logs recorded yet</Text>
        ) : (
          employee.attendances.map((att: any, idx: number) => {
            const dateStr = formatDate(att.attendanceDate);
            const inStr = formatTime(att.checkIn);
            const outStr = formatTime(att.checkOut);
            
            let statusLabel = 'Full Day';
            let statusColor = colors.success;
            let statusBg = colors.successBg;
            if (att.status === 'HALF_DAY') {
              statusLabel = 'Half Day';
              statusColor = colors.warning;
              statusBg = colors.warningBg;
            } else if (att.status === 'ABSENT') {
              statusLabel = 'Absent';
              statusColor = colors.danger;
              statusBg = colors.dangerBg;
            }

            return (
              <View key={att.id || idx}>
                <View style={styles.logRow}>
                  <View style={styles.logInfo}>
                    <Text style={styles.logDate}>{dateStr}</Text>
                    <Text style={styles.logTime}>
                      In: {inStr} • Out: {outStr}
                    </Text>
                  </View>
                  <View style={[styles.statusBadgeBadge, { backgroundColor: statusBg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusColor }]}>{statusLabel}</Text>
                  </View>
                </View>
                {idx < (employee.attendances || []).length - 1 && <View style={styles.divider} />}
              </View>
            );
          })
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <AppButton
            title="Edit"
            onPress={() => navigation.navigate('EditEmployee', { id })}
            variant="primary"
            fullWidth
            icon={<MaterialCommunityIcons name="pencil" size={18} color="#FFF" />}
          />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <AppButton
            title="Delete"
            onPress={handleDelete}
            variant="danger"
            loading={deleteEmployee.isPending}
            fullWidth
            icon={<MaterialCommunityIcons name="trash-can-outline" size={18} color="#FFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  designation: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  deptBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  deptText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoLabel: {
    ...typography.small,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: spacing['3xl'],
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  logInfo: {
    flex: 1,
  },
  logDate: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  logTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadgeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    ...typography.small,
    fontWeight: '700',
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
