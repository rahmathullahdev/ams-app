import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { EmployeeNavigator } from './src/navigation/EmployeeNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { LoadingSpinner } from '@attendance/ui';

if (Platform.OS === 'web') {
  const doc = (globalThis as any).document;
  if (doc) {
    const style = doc.createElement('style');
    style.textContent = `
      input, textarea, select {
        outline: none !important;
        outline-width: 0 !important;
        border-width: 0 !important;
        border-style: none !important;
        box-shadow: none !important;
      }
    `;
    doc.head.appendChild(style);
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const NavigationWrapper: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user ? (
        user.role === 'admin' ? (
          <RootNavigator />
        ) : (
          <EmployeeNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationWrapper />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
