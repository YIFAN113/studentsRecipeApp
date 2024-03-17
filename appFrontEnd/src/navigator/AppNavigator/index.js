import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../pages/loginPage';
import HomeScreen from '../../pages/HomePage';
import RecipeDetailScreen from '../../pages/recipePage';
import RecipeUploadScreen from '../../pages/recipeUploadPage'
import SignUpCsreen from '../../pages/signUpPage'

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="recipe" 
          component={RecipeDetailScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="recipeUpload" 
          component={RecipeUploadScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="signup" 
          component={SignUpCsreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;