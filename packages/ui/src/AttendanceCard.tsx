import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from './theme';

interface AttendanceCardProps {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
  employeeName?: string;
}

const statusConfig = {
  PRESENT: { label: 'Present', color: colors.success, bg: colors.successBg },
  ABSENT: { label: 'Absent', color: colors.danger, bg: colors.dangerBg },
  HALF_DAY: { label: 'Half Day', color: colors.warning, bg: colors.warningBg },
};

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  date,
  checkIn,
  checkOut,
  status,
  employeeName,
}) => {
  const config = statusConfig[status];

  const formatTime = (isoString: string | null): string => {
    if (!isoString) return '--:--';
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.leftStrip}>
        <View style={[styles.statusDot, { backgroundColor: config.color }]} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.date}>{formatDate(date)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>
        {employeeName && <Text style={styles.employeeName}>{employeeName}</Text>}
        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Check In</Text>
            <Text style={styles.timeValue}>{formatTime(checkIn)}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Check Out</Text>
            <Text style={styles.timeValue}>{formatTime(checkOut)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  leftStrip: {
    width: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 4,
    height: '100%',
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
  },
  employeeName: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    ...typography.small,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  timeValue: {
    ...typography.bodyMedium,
    color: colors.text,
    marginTop: 2,
  },
  timeDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
});
