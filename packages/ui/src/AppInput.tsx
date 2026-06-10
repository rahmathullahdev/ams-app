import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  Platform,
} from 'react-native';
import { colors, borderRadius, typography, spacing } from './theme';

interface AppInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  containerStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error ? styles.inputWrapperError : {},
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          style={[styles.input, icon ? { paddingLeft: 0 } : {}]}
          placeholderTextColor={colors.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.captionMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    minHeight: 50,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        outline: 'none',
        borderStyle: 'none',
      } as any,
    }),
  },
  iconLeft: {
    paddingLeft: spacing.lg,
  },
  iconRight: {
    paddingRight: spacing.lg,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
