import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';

// Define the types for your routes
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}