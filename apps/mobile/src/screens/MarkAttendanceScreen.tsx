import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, AppButton, LoadingSpinner } from '@attendance/ui';
import { useCheckIn, useCheckOut } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AttendanceStackParamList } from '../navigation/AttendanceStack';
import { AttendanceStatus } from '@attendance/shared-types';
import { getTodayDateString } from '../utils/formatters';

type Props = NativeStackScreenProps<AttendanceStackParamList, 'MarkAttendance'>;

const statusOptions: { value: AttendanceStatus; label: string; color: string; icon: string }[] = [
  { value: 'PRESENT', label: 'Present', color: colors.success, icon: 'check-circle' },
  { value: 'HALF_DAY', label: 'Half Day', color: colors.warning, icon: 'clock-alert-outline' },
  { value: 'ABSENT', label: 'Absent', color: colors.danger, icon: 'close-circle' },
];

export const MarkAttendanceScreen: React.FC<Props> = ({ route, navigation }) => {
  const { employeeId: preselectedId, employeeName: preselectedName } = route.params || {};
  const { data: employees, isLoading } = useEmployees();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(preselectedId || '');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>(preselectedName || '');
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('PRESENT');

  if (isLoading) return <LoadingSpinner />;

  const handleCheckIn = async () => {
    if (!selectedEmployeeId) {
      Alert.alert('Error', 'Please select an employee');
      return;
    }

    try {
      await checkIn.mutateAsync({
        employeeId: selectedEmployeeId,
        status: selectedStatus,
      });
      Alert.alert('Success', `${selectedEmployeeName} checked in successfully`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      // Handled by mutation
    }
  };

  const handleCheckOut = async () => {
    if (!selectedEmployeeId) {
      Alert.alert('Error', 'Please select an employee');
      return;
    }

    try {
      await checkOut.mutateAsync({ employeeId: selectedEmployeeId });
      Alert.alert('Success', `${selectedEmployeeName} checked out successfully`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      // Handled by mutation
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Date Display */}
      <View style={[styles.dateCard, shadows.card]}>
        <MaterialCommunityIcons name="calendar-today" size={24} color={colors.primary} />
        <Text style={styles.dateText}>{getTodayDateString()}</Text>
      </View>

      {/* Employee Selection */}
      {!preselectedId && (
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.sectionTitle}>Select Employee</Text>
          <ScrollView
            horizontal={false}
            style={styles.employeeList}
            nestedScrollEnabled
          >
            {employees?.map((emp) => {
              const isSelected = selectedEmployeeId === emp.id;
              const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              return (
                <TouchableOpacity
                  key={emp.id}
                  style={[styles.employeeOption, isSelected && styles.employeeOptionSelected]}
                  onPress={() => {
                    setSelectedEmployeeId(emp.id);
                    setSelectedEmployeeName(emp.name);
                  }}
                >
                  <View style={[styles.miniAvatar, isSelected && { backgroundColor: colors.primary }]}>
                    <Text style={[styles.miniAvatarText, isSelected && { color: '#FFF' }]}>{initials}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={[styles.optionName, isSelected && { color: colors.primary }]}>{emp.name}</Text>
                    <Text style={styles.optionDept}>{emp.department}</Text>
                  </View>
                  {isSelected && <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Selected Employee (if preselected) */}
      {preselectedId && (
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.sectionTitle}>Employee</Text>
          <View style={styles.selectedEmployee}>
            <MaterialCommunityIcons name="account-circle" size={24} color={colors.primary} />
            <Text style={styles.selectedName}>{preselectedName}</Text>
          </View>
        </View>
      )}

      {/* Status Selection */}
      <View style={[styles.card, shadows.card]}>
        <Text style={styles.sectionTitle}>Attendance Status</Text>
        <View style={styles.statusRow}>
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  isSelected && { borderColor: option.color, backgroundColor: option.color + '10' },
                ]}
                onPress={() => setSelectedStatus(option.value)}
              >
                <MaterialCommunityIcons
                  name={option.icon as any}
                  size={28}
                  color={isSelected ? option.color : colors.textTertiary}
                />
                <Text
                  style={[
                    styles.statusLabel,
                    isSelected && { color: option.color, fontWeight: '600' },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <AppButton
          title="Check In"
          onPress={handleCheckIn}
          loading={checkIn.isPending}
          fullWidth
          variant="primary"
          size="lg"
          icon={<MaterialCommunityIcons name="login" size={20} color="#FFF" />}
        />
        <View style={{ height: spacing.md }} />
        <AppButton
          title="Check Out"
          onPress={handleCheckOut}
          loading={checkOut.isPending}
          fullWidth
          variant="outline"
          size="lg"
          icon={<MaterialCommunityIcons name="logout" size={20} color={colors.primary} />}
        />
      </View>
    </ScrollView>
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
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  dateText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  employeeList: {
    maxHeight: 250,
  },
  employeeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  employeeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.textSecondary,
  },
  optionName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  optionDept: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  selectedEmployee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  selectedName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  statusLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  actionsContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing['3xl'],
  },
});
