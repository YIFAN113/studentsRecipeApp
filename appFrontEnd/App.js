import React, { Component } from 'react'
import { Text, View } from 'react-native'
//import Index from './src/pages/mapPage'
import BottomTabNavigator from './src/navigator/bottom-tabs'
export default class App extends Component {
  render() {
    return (
      <BottomTabNavigator />
    )
  }
}
