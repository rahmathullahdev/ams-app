import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, EmployeeCard, LoadingSpinner, EmptyState } from '@attendance/ui';
import { useEmployees } from '../hooks/useEmployees';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmployeeStackParamList } from '../navigation/EmployeeStack';
import { useNavigation } from '@react-navigation/native';
import { Employee } from '@attendance/shared-types';

type NavigationProp = NativeStackNavigationProp<EmployeeStackParamList, 'EmployeeList'>;

export const EmployeeListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const { data: employees, isLoading, refetch, isRefetching } = useEmployees(search || undefined);

  const renderItem = useCallback(({ item }: { item: Employee }) => (
    <EmployeeCard
      name={item.name}
      employeeId={item.employeeId}
      department={item.department}
      designation={item.designation}
      onPress={() => navigation.navigate('EmployeeDetail', { id: item.id })}
    />
  ), [navigation]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Employee List */}
      <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<MaterialCommunityIcons name="account-search" size={36} color={colors.primary} />}
            title="No Employees Found"
            message={search ? `No results for "${search}"` : 'Add your first employee to get started'}
            actionLabel={!search ? 'Add Employee' : undefined}
            onAction={!search ? () => navigation.navigate('AddEmployee') : undefined}
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddEmployee')}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
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
  listContent: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
