import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { ExpenseProvider } from './src/context/ExpenseContext';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <PaperProvider>
      <ExpenseProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </ExpenseProvider>
    </PaperProvider>
  );
}
