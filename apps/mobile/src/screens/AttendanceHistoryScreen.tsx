import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, AttendanceCard, LoadingSpinner, EmptyState } from '@attendance/ui';
import { useAttendanceHistory, useAttendanceSummary } from '../hooks/useAttendance';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AttendanceStackParamList } from '../navigation/AttendanceStack';
import { Attendance } from '@attendance/shared-types';

type Props = NativeStackScreenProps<AttendanceStackParamList, 'AttendanceHistory'>;

export const AttendanceHistoryScreen: React.FC<Props> = ({ route }) => {
  const { employeeId, employeeName } = route.params;
  const { data: history, isLoading, refetch, isRefetching } = useAttendanceHistory(employeeId);
  const { data: summary } = useAttendanceSummary(employeeId);

  if (isLoading) return <LoadingSpinner />;

  const renderHeader = () => (
    <View>
      {/* Employee Name */}
      <Text style={styles.employeeName}>{employeeName}</Text>

      {/* Monthly Summary */}
      {summary && (
        <View style={[styles.summaryCard, shadows.card]}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons name="chart-bar" size={20} color={colors.primary} />
            <Text style={styles.summaryTitle}>
              {summary.month} {summary.year} Summary
            </Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.success }]}>{summary.presentDays}</Text>
              <Text style={styles.summaryLabel}>Present</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.danger }]}>{summary.absentDays}</Text>
              <Text style={styles.summaryLabel}>Absent</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.warning }]}>{summary.halfDays}</Text>
              <Text style={styles.summaryLabel}>Half Day</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>{summary.attendancePercentage}%</Text>
              <Text style={styles.summaryLabel}>Rate</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(summary.attendancePercentage, 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      <Text style={styles.historyTitle}>Attendance Records</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Attendance }) => (
    <AttendanceCard
      date={item.attendanceDate}
      checkIn={item.checkIn}
      checkOut={item.checkOut}
      status={item.status}
    />
  );

  return (
    <FlatList
      style={styles.container}
      data={history}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
      ListEmptyComponent={
        <EmptyState
          icon={<MaterialCommunityIcons name="calendar-blank" size={36} color={colors.primary} />}
          title="No Records"
          message="No attendance records found for this employee"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.xl,
    flexGrow: 1,
  },
  employeeName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.text,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  historyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
});
