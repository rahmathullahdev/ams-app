import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, AppButton, AppInput } from '@attendance/ui';
import { useAuth } from '../context/AuthContext';

const logoImg = require('../../assets/icon.png');

export const LoginScreen: React.FC = () => {
  const { loginAsAdmin, loginAsEmployee } = useAuth();

  const [activeTab, setActiveTab] = useState<'employee' | 'admin'>('employee');
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (activeTab === 'employee') {
        if (!employeeId.trim()) {
          throw new Error('Please enter your Employee ID.');
        }
        if (!employeePassword.trim()) {
          throw new Error('Please enter your Password.');
        }
        await loginAsEmployee(employeeId.trim(), employeePassword.trim());
      } else {
        if (!adminEmail.trim()) {
          throw new Error('Please enter your Admin Email.');
        }
        if (!adminPassword.trim()) {
          throw new Error('Please enter your Password.');
        }
        await loginAsAdmin(adminEmail.trim(), adminPassword.trim());
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={[styles.logoBadge, shadows.lg]}>
            <Image source={logoImg} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={styles.brandName}>AMS</Text>
          <Text style={styles.brandSubtitle}>Secure HR & Attendance Portal</Text>
        </View>

        {/* Login Card Container */}
        <View style={[styles.loginCard, shadows.card]}>
          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'employee' && styles.activeTabButton]}
              onPress={() => {
                setActiveTab('employee');
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={18}
                color={activeTab === 'employee' ? colors.primary : colors.textTertiary}
              />
              <Text style={[styles.tabText, activeTab === 'employee' && styles.activeTabText]}>
                Employee
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'admin' && styles.activeTabButton]}
              onPress={() => {
                setActiveTab('admin');
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="shield-account-outline"
                size={18}
                color={activeTab === 'admin' ? colors.primary : colors.textTertiary}
              />
              <Text style={[styles.tabText, activeTab === 'admin' && styles.activeTabText]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {errorMessage && (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.danger} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {activeTab === 'employee' ? (
              <>
                <AppInput
                  label="Employee ID"
                  placeholder="e.g. EMP-001"
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  icon={<MaterialCommunityIcons name="badge-account-outline" size={20} color={colors.textTertiary} />}
                  autoCapitalize="characters"
                />

                <AppInput
                  label="Password"
                  placeholder="Enter employee password (password123)"
                  value={employeePassword}
                  onChangeText={setEmployeePassword}
                  secureTextEntry
                  icon={<MaterialCommunityIcons name="lock-outline" size={20} color={colors.textTertiary} />}
                />
              </>
            ) : (
              <>
                <AppInput
                  label="Admin Email"
                  placeholder="e.g. admin@company.com"
                  value={adminEmail}
                  onChangeText={setAdminEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<MaterialCommunityIcons name="email-outline" size={20} color={colors.textTertiary} />}
                />

                <AppInput
                  label="Password"
                  placeholder="Enter admin password (admin123)"
                  value={adminPassword}
                  onChangeText={setAdminPassword}
                  secureTextEntry
                  icon={<MaterialCommunityIcons name="lock-outline" size={20} color={colors.textTertiary} />}
                />
              </>
            )}

            <AppButton
              title={activeTab === 'admin' ? 'Login as Admin' : 'Login as Employee'}
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={{ marginTop: spacing.xl }}
              icon={<MaterialCommunityIcons name="login" size={20} color="#FFF" />}
            />
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Admins: admin@company.com / admin123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: '85%',
    height: '85%',
    borderRadius: borderRadius.xl,
  },
  brandName: {
    ...typography.h1,
    color: colors.text,
  },
  brandSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  loginCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.xl,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  activeTabButton: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  tabText: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  formContainer: {
    gap: spacing.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.captionMedium,
    color: colors.danger,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
    gap: spacing.xs,
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
