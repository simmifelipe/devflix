import React from 'react';
import MovieDetail from './src/screens/MovieDetail';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Tabs from './src/routes/tabs';
import { StatusBar } from 'react-native';
import { COLORS } from './src/constants';
import SignIn from './src/screens/SignIn';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.black}
        translucent
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={'SignIn'}>
        <Stack.Screen name="Home" component={Tabs} />

        <Stack.Screen name="MovieDetail" component={MovieDetail} />
        <Stack.Screen name="SignIn" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
