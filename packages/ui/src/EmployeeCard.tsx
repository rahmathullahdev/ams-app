import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from './theme';

interface EmployeeCardProps {
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  onPress?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  name,
  employeeId,
  department,
  designation,
  onPress,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const avatarColors = [
    '#4F46E5', '#0EA5E9', '#10B981', '#F59E0B',
    '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4',
  ];
  const colorIndex =
    name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;

  return (
    <TouchableOpacity
      style={[styles.card, shadows.card]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColors[colorIndex] }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.designation} numberOfLines={1}>{designation}</Text>
        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{department}</Text>
          </View>
          <Text style={styles.empId}>#{employeeId}</Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  designation: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.small,
    color: colors.primary,
  },
  empId: {
    ...typography.small,
    color: colors.textTertiary,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  chevronText: {
    fontSize: 24,
    color: colors.textTertiary,
    fontWeight: '300',
  },
});
