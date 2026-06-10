import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEmployeeSchema, CreateEmployeeInput } from '@attendance/shared-types';
import { colors, spacing, typography, borderRadius, shadows, AppButton, AppInput } from '@attendance/ui';
import { useCreateEmployee } from '../hooks/useEmployees';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmployeeStackParamList } from '../navigation/EmployeeStack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<EmployeeStackParamList, 'AddEmployee'>;

export const AddEmployeeScreen: React.FC<Props> = ({ navigation }) => {
  const createEmployee = useCreateEmployee();
  
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.3)).current;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
    },
  });

  const onSubmit = async (data: CreateEmployeeInput) => {
    try {
      await createEmployee.mutateAsync(data);
      
      // Start the success animation sequence
      setStatus('success');
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      // Delay for 1.8 seconds, then fade out and return to the list
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setStatus('idle');
          navigation.goBack();
        });
      }, 1800);

    } catch (error: any) {
      const msg = error?.message || 'Failed to create employee';
      setErrorMessage(msg);
      setStatus('error');
      
      // Animate the error overlay
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const dismissError = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStatus('idle');
      setErrorMessage('');
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.sectionTitle}>Employee Information</Text>

          <Controller
            control={control}
            name="employeeId"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Employee ID"
                placeholder="e.g. EMP-011"
                value={value}
                onChangeText={onChange}
                error={errors.employeeId?.message}
                icon={<MaterialCommunityIcons name="badge-account" size={20} color={colors.textTertiary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Full Name"
                placeholder="e.g. John Doe"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                icon={<MaterialCommunityIcons name="account" size={20} color={colors.textTertiary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Email Address"
                placeholder="e.g. john@company.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
                icon={<MaterialCommunityIcons name="email-outline" size={20} color={colors.textTertiary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Phone Number"
                placeholder="e.g. 9876543210"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                error={errors.phone?.message}
                icon={<MaterialCommunityIcons name="phone-outline" size={20} color={colors.textTertiary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="department"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Department"
                placeholder="e.g. Engineering"
                value={value}
                onChangeText={onChange}
                error={errors.department?.message}
                icon={<MaterialCommunityIcons name="domain" size={20} color={colors.textTertiary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="designation"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Designation"
                placeholder="e.g. Software Engineer"
                value={value}
                onChangeText={onChange}
                error={errors.designation?.message}
                icon={<MaterialCommunityIcons name="briefcase-outline" size={20} color={colors.textTertiary} />}
              />
            )}
          />
        </View>

        <AppButton
          title="Create Employee"
          onPress={handleSubmit(onSubmit)}
          loading={createEmployee.isPending}
          fullWidth
          icon={<MaterialCommunityIcons name="check" size={20} color="#FFF" />}
          style={{ marginTop: spacing.xl }}
        />

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>

      {status !== 'idle' && (
        <Animated.View style={[styles.successOverlay, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.successCard,
              shadows.lg,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {status === 'success' ? (
              <>
                <View style={styles.successIconBadge}>
                  <MaterialCommunityIcons name="check" size={42} color="#FFF" />
                </View>
                <Text style={styles.successTitle}>Employee Added!</Text>
                <Text style={styles.successSubtitle}>
                  The new employee profile has been created successfully.
                </Text>
              </>
            ) : (
              <>
                <View style={styles.errorIconBadge}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={45} color="#FFF" />
                </View>
                <Text style={styles.errorTitle}>Action Failed</Text>
                <Text style={styles.errorSubtitle}>
                  {errorMessage}
                </Text>
                <AppButton
                  title="Try Again"
                  onPress={dismissError}
                  variant="outline"
                  fullWidth
                  style={{ marginTop: spacing.xl }}
                />
              </>
            )}
          </Animated.View>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  successCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    width: '80%',
    alignItems: 'center',
  },
  successIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.danger,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
