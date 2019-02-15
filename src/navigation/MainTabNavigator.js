import React from 'react'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import { TabBar } from '../components/TabBar'
import { TabBarIcon } from '../components/TabBarIcon'

import HomeScreen from '../screens/HomeScreen'
import ArchiveScreen from '../screens/ArchiveScreen'
import FavoritesScreen from '../screens/FavoritesScreen'
import SettingsScreen from '../screens/SettingsScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'headphones'}
    />
  ),
}

const ArchiveStack = createStackNavigator({
  Archive: ArchiveScreen,
})

ArchiveStack.navigationOptions = {
  tabBarLabel: 'Archive',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'archive'}
    />
  ),
}


const FavoritesStack = createStackNavigator({
  Favorites: FavoritesScreen,
})

FavoritesStack.navigationOptions = {
  tabBarLabel: 'Favorites',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'heart'}
    />
  ),
}

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'settings'}
    />
  ),
}

export default createBottomTabNavigator({
    HomeStack,
    ArchiveStack,
    FavoritesStack,
    SettingsStack,
  },
  {
    tabBarComponent: props => {
      return <TabBar {...props} />
    },
    tabBarOptions: {
      showLabel: false
    }
  }
)
