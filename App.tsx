import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/theme';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
