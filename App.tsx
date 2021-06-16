import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';
import { StatusBar } from 'react-native';
import { COLORS } from './src/constants';
import AppProvider from './src/hooks';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.black}
        translucent
      />
      <AppProvider>
        <Routes />
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;
