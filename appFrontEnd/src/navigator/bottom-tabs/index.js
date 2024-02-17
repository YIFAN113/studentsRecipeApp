import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../../pages/loginPage';
import RegisterScreen from '../../pages/signUpPage';
import MapScreen from '../../pages/mapPage';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Login"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{ tabBarLabel: 'login' }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterScreen}
        options={{ tabBarLabel: 'signUp' }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarLabel: 'map' }}
      />
    </Tab.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}