import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from './theme';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  bgColor,
  style,
}) => {
  return (
    <View style={[styles.card, shadows.card, style]}>
      <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    minWidth: 140,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  value: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
