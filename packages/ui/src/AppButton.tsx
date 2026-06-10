import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, borderRadius, typography, spacing, shadows } from './theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;

  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.base, sizeStyles[size]];
    if (fullWidth) base.push({ width: '100%' });

    switch (variant) {
      case 'primary':
        base.push(styles.primary, shadows.card);
        break;
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'outline':
        base.push(styles.outline);
        break;
      case 'danger':
        base.push(styles.danger, shadows.card);
        break;
      case 'ghost':
        base.push(styles.ghost);
        break;
    }

    if (isDisabled) base.push(styles.disabled);
    return base;
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle[] = [styles.text, sizeTextStyles[size]];

    switch (variant) {
      case 'primary':
      case 'danger':
        base.push({ color: '#FFFFFF' });
        break;
      case 'secondary':
        base.push({ color: colors.primary });
        break;
      case 'outline':
        base.push({ color: colors.primary });
        break;
      case 'ghost':
        base.push({ color: colors.textSecondary });
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[...getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#FFF' : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[...getTextStyle(), icon ? { marginLeft: spacing.sm } : {}, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryBg,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  md: { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing['2xl'] },
};

const sizeTextStyles: Record<string, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 16 },
};
