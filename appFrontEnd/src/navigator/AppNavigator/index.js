import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../pages/loginPage';
import HomeScreen from '../../pages/HomePage';
import RecipeDetailScreen from '../../pages/recipePage';
import RecipeUploadScreen from '../../pages/recipeUploadPage'
import SignUpScreen from '../../pages/signUpPage'
import MapScreen from '../../pages/mapPage'
import SearchScreen from '../../pages/searchPage'
import ReviewUploadScreen from '../../pages/reviewUploadPage'
import FavouritesScreen from '../../pages/favouritesPage'
import UserProfileScreen from '../../pages/profileChangePage'
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
          component={SignUpScreen} 
          options={{ headerShown: false }} 
        />
 <Stack.Screen 
          name="map" 
          component={MapScreen} 
          options={{ headerShown: false }} 
        />

<Stack.Screen 
          name="search" 
          component={SearchScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="review" 
          component={ReviewUploadScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="favourites" 
          component={FavouritesScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfileScreen} 
          options={{ headerShown: false }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;