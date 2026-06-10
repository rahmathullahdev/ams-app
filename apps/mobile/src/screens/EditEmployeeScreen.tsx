import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateEmployeeSchema, UpdateEmployeeInput } from '@attendance/shared-types';
import { colors, spacing, typography, borderRadius, shadows, AppButton, AppInput, LoadingSpinner } from '@attendance/ui';
import { useEmployee, useUpdateEmployee } from '../hooks/useEmployees';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmployeeStackParamList } from '../navigation/EmployeeStack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<EmployeeStackParamList, 'EditEmployee'>;

export const EditEmployeeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { data: employee, isLoading } = useEmployee(id);
  const updateEmployee = useUpdateEmployee();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateEmployeeInput>({
    resolver: zodResolver(UpdateEmployeeSchema),
    values: employee
      ? {
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          designation: employee.designation,
        }
      : undefined,
  });

  if (isLoading || !employee) return <LoadingSpinner />;

  const onSubmit = async (data: UpdateEmployeeInput) => {
    try {
      await updateEmployee.mutateAsync({ id, data });
      Alert.alert('Success', 'Employee updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      // Error handled by mutation
    }
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
          <Text style={styles.sectionTitle}>Edit Information</Text>

          <Controller
            control={control}
            name="employeeId"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Employee ID"
                value={value || ''}
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
                value={value || ''}
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
                value={value || ''}
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
                value={value || ''}
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
                value={value || ''}
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
                value={value || ''}
                onChangeText={onChange}
                error={errors.designation?.message}
                icon={<MaterialCommunityIcons name="briefcase-outline" size={20} color={colors.textTertiary} />}
              />
            )}
          />
        </View>

        <AppButton
          title="Save Changes"
          onPress={handleSubmit(onSubmit)}
          loading={updateEmployee.isPending}
          fullWidth
          icon={<MaterialCommunityIcons name="content-save" size={20} color="#FFF" />}
          style={{ marginTop: spacing.xl }}
        />

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
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
});
