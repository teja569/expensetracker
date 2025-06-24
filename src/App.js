import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { ExpenseProvider } from './src/context/ExpenseContext';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(() => (
    isDarkMode ? MD3DarkTheme : MD3LightTheme
  ), [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <PaperProvider theme={theme}>
      <ExpenseProvider>
        <NavigationContainer theme={theme}>
          <MainNavigator isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </NavigationContainer>
      </ExpenseProvider>
    </PaperProvider>
  );
}
