import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, LoadingSpinner, EmptyState } from '@attendance/ui';
import { useAuth } from '../context/AuthContext';
import { useAttendanceHistory } from '../hooks/useAttendance';
import { formatDate, formatTime } from '../utils/formatters';

export const EmployeeHistoryScreen: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'employee') {
    return null;
  }

  const { employee } = user;
  const { data: history, isLoading, refetch, isRefetching } = useAttendanceHistory(employee.id);

  if (isLoading) return <LoadingSpinner />;

  const getStatusBadgeConfig = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return { label: 'Full Day', color: colors.success, bgColor: colors.successBg };
      case 'HALF_DAY':
        return { label: 'Half Day', color: colors.warning, bgColor: colors.warningBg };
      default:
        return { label: 'Absent', color: colors.danger, bgColor: colors.dangerBg };
    }
  };

  const renderHistoryItem = ({ item }: { item: any }) => {
    const badge = getStatusBadgeConfig(item.status);
    
    return (
      <View style={[styles.historyRow, shadows.sm]}>
        {/* Left Indicator */}
        <View style={[styles.avatarBadge, { backgroundColor: badge.bgColor }]}>
          <MaterialCommunityIcons 
            name={item.checkOut ? "clock-check-outline" : "clock-fast"} 
            size={22} 
            color={badge.color} 
          />
        </View>

        {/* Center Info */}
        <View style={styles.infoCol}>
          <Text style={styles.dateText}>{formatDate(item.attendanceDate)}</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>In</Text>
              <Text style={styles.timeValue}>{formatTime(item.checkIn)}</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Out</Text>
              <Text style={styles.timeValue}>{formatTime(item.checkOut)}</Text>
            </View>
          </View>
        </View>

        {/* Right Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: badge.bgColor }]}>
          <Text style={[styles.statusBadgeText, { color: badge.color }]}>
            {badge.label}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Custom Header Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Log</Text>
        <Text style={styles.headerSubtitle}>Your check-in and check-out logs</Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<MaterialCommunityIcons name="clipboard-text-off-outline" size={42} color={colors.textTertiary} />}
            title="No Attendance History"
            message="Your check-in and check-out records will appear here."
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
    flexGrow: 1,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: spacing.lg,
    gap: spacing.xs,
  },
  dateText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  timeValue: {
    ...typography.captionMedium,
    color: colors.textSecondary,
  },
  timeDivider: {
    width: 1,
    height: 10,
    backgroundColor: colors.border,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    ...typography.small,
    fontWeight: '700',
  },
});
