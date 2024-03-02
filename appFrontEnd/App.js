import React, { Component } from 'react'
import { Text, View } from 'react-native'
//import Index from './src/pages/mapPage'
import BottomTabNavigator from './src/navigator/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigator/AppNavigator'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class App extends Component {
  render() {
    return (
      
        <AppNavigator />
      
      
    )
  }
}
