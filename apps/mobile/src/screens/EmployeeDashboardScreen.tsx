import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, AppButton, LoadingSpinner } from '@attendance/ui';
import { useAuth } from '../context/AuthContext';
import { useAttendanceHistory, useCheckIn, useCheckOut } from '../hooks/useAttendance';
import { formatTime, getGreeting, getTodayDateString } from '../utils/formatters';

export const EmployeeDashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Guard for safety
  if (!user || user.role !== 'employee') {
    return null;
  }
  
  const { employee } = user;
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  // Fetch today's check-in status from history
  const { data: history, isLoading, refetch, isRefetching } = useAttendanceHistory(employee.id);

  const [selectedStatus, setSelectedStatus] = useState<'PRESENT' | 'HALF_DAY'>('PRESENT');

  // Animation states
  const [showAnimation, setShowAnimation] = useState(false);
  const [animType, setAnimType] = useState<'in' | 'out'>('in');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  // Determine today's record
  const getTodayRecord = () => {
    if (!history || history.length === 0) return null;
    const latest = history[0];
    const recordDate = new Date(latest.attendanceDate);
    const today = new Date();
    
    if (
      recordDate.getFullYear() === today.getFullYear() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getDate() === today.getDate()
    ) {
      return latest;
    }
    return null;
  };

  const todayRecord = getTodayRecord();

  const handleCheckIn = async () => {
    try {
      await checkIn.mutateAsync({
        employeeId: employee.id,
        status: selectedStatus,
      });
      triggerAnimation('in');
      refetch();
    } catch (e) {
      // Error is caught/alerted by query/interceptor
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut.mutateAsync({
        employeeId: employee.id,
      });
      triggerAnimation('out');
      refetch();
    } catch (e) {
      // Error caught/alerted
    }
  };

  const triggerAnimation = (type: 'in' | 'out') => {
    setAnimType(type);
    setShowAnimation(true);
    
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

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowAnimation(false);
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.3);
      });
    }, 2000);
  };

  // Determine current status configuration
  const getStatusConfig = () => {
    if (!todayRecord) {
      return {
        text: 'Not Checked In',
        color: colors.textTertiary,
        bgColor: colors.borderLight,
        icon: 'clock-outline',
        description: 'You have not registered your attendance for today.',
      };
    }
    if (todayRecord.checkIn && !todayRecord.checkOut) {
      return {
        text: `Checked In at ${formatTime(todayRecord.checkIn ? todayRecord.checkIn.toString() : null)}`,
        color: colors.success,
        bgColor: colors.successBg,
        icon: 'login',
        description: 'You are currently active. Remember to check out when leaving.',
      };
    }
    return {
      text: 'Checked Out',
      color: colors.textSecondary,
      bgColor: colors.borderLight,
      icon: 'logout',
      description: `Today's Shift Completed: In at ${formatTime(todayRecord.checkIn ? todayRecord.checkIn.toString() : null)} • Out at ${formatTime(todayRecord.checkOut ? todayRecord.checkOut.toString() : null)}`,
    };
  };

  const statusConfig = getStatusConfig();

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Modern Premium Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerGreeting}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.name}>{employee.name}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <MaterialCommunityIcons name="logout" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerDateContainer}>
            <MaterialCommunityIcons name="calendar" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={styles.headerDate}>{getTodayDateString()}</Text>
          </View>
        </LinearGradient>

        {/* Attendance Status Banner Card */}
        <View style={[styles.statusCard, shadows.card]}>
          <View style={[styles.statusIconWrap, { backgroundColor: statusConfig.bgColor }]}>
            <MaterialCommunityIcons name={statusConfig.icon as any} size={28} color={statusConfig.color} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitleLabel}>Today's Status</Text>
            <Text style={[styles.statusState, { color: statusConfig.color }]}>{statusConfig.text}</Text>
            <Text style={styles.statusDesc}>{statusConfig.description}</Text>
          </View>
        </View>

        {/* Self check-in actions */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {!todayRecord && (
              <View style={[styles.card, shadows.card]}>
                <Text style={styles.sectionTitle}>Check In Configuration</Text>
                
                <View style={styles.statusRow}>
                  <TouchableOpacity
                    style={[
                      styles.statusOption,
                      selectedStatus === 'PRESENT' && {
                        borderColor: colors.success,
                        backgroundColor: colors.successBg,
                      },
                    ]}
                    onPress={() => setSelectedStatus('PRESENT')}
                  >
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={24}
                      color={selectedStatus === 'PRESENT' ? colors.success : colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.statusOptionLabel,
                        selectedStatus === 'PRESENT' && { color: colors.success, fontWeight: '600' },
                      ]}
                    >
                      Full Day
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusOption,
                      selectedStatus === 'HALF_DAY' && {
                        borderColor: colors.warning,
                        backgroundColor: colors.warningBg,
                      },
                    ]}
                    onPress={() => setSelectedStatus('HALF_DAY')}
                  >
                    <MaterialCommunityIcons
                      name="clock-alert-outline"
                      size={24}
                      color={selectedStatus === 'HALF_DAY' ? colors.warning : colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.statusOptionLabel,
                        selectedStatus === 'HALF_DAY' && { color: colors.warning, fontWeight: '600' },
                      ]}
                    >
                      Half Day
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Main Action Buttons */}
            <View style={styles.actionBlock}>
              {!todayRecord && (
                <AppButton
                  title="Check In Now"
                  onPress={handleCheckIn}
                  loading={checkIn.isPending}
                  fullWidth
                  variant="primary"
                  size="lg"
                  icon={<MaterialCommunityIcons name="login" size={22} color="#FFF" />}
                  style={styles.mainButton}
                />
              )}

              {todayRecord && !todayRecord.checkOut && (
                <AppButton
                  title="Check Out Now"
                  onPress={handleCheckOut}
                  loading={checkOut.isPending}
                  fullWidth
                  variant="danger"
                  size="lg"
                  icon={<MaterialCommunityIcons name="logout" size={22} color="#FFF" />}
                  style={styles.mainButton}
                />
              )}

              {todayRecord && todayRecord.checkOut && (
                <View style={styles.completedBanner}>
                  <MaterialCommunityIcons name="check-decagram" size={24} color={colors.success} />
                  <Text style={styles.completedText}>Shift Completed for Today</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Profile Card */}
        <View style={[styles.profileCard, shadows.card]}>
          <Text style={styles.profileSectionTitle}>Profile Information</Text>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{initials}</Text>
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.profileName}>{employee.name}</Text>
              <Text style={styles.profileId}>ID: {employee.employeeId}</Text>
            </View>
          </View>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="domain" size={18} color={colors.textTertiary} />
              <View>
                <Text style={styles.detailLabel}>Department</Text>
                <Text style={styles.detailValue}>{employee.department}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="briefcase-outline" size={18} color={colors.textTertiary} />
              <View>
                <Text style={styles.detailLabel}>Designation</Text>
                <Text style={styles.detailValue}>{employee.designation}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="email-outline" size={18} color={colors.textTertiary} />
              <View>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{employee.email}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>

      {/* Check In/Out Success Animation overlay */}
      {showAnimation && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.modalCard, shadows.lg, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.modalBadge, { backgroundColor: colors.success }]}>
              <MaterialCommunityIcons name="check" size={42} color="#FFF" />
            </View>
            <Text style={styles.modalTitle}>
              {animType === 'in' ? 'Checked In!' : 'Checked Out!'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {animType === 'in'
                ? 'Your check-in timestamp has been successfully recorded.'
                : 'Your check-out timestamp has been successfully recorded.'}
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerGreeting: {
    flex: 1,
  },
  greeting: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  name: {
    ...typography.h2,
    color: '#FFF',
    marginTop: 2,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  headerDate: {
    ...typography.captionMedium,
    color: 'rgba(255,255,255,0.8)',
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: -spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.lg,
  },
  statusIconWrap: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitleLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  statusState: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  statusDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  statusOptionLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  actionBlock: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  mainButton: {
    paddingVertical: spacing.lg,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successBg,
    borderColor: colors.success + '20',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  completedText: {
    ...typography.bodyMedium,
    color: colors.success,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  profileSectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    ...typography.bodyMedium,
    fontSize: 16,
    color: colors.text,
  },
  profileId: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailsGrid: {
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  detailValue: {
    ...typography.bodyMedium,
    color: colors.text,
    marginTop: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    width: '80%',
    alignItems: 'center',
  },
  modalBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
