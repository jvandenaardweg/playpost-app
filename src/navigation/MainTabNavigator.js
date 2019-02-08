import React from 'react'
import { Platform, View, Text } from 'react-native'
import { createStackNavigator, createBottomTabNavigator, BottomTabBar } from 'react-navigation'

import { AudioPlayerContainer } from '../containers/AudioPlayerContainer';
import TabBarIcon from '../components/TabBarIcon'

import HomeScreen from '../screens/HomeScreen'
import SummariesScreen from '../screens/SummariesScreen'
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

const SummariesStack = createStackNavigator({
  Summaries: SummariesScreen,
})

SummariesStack.navigationOptions = {
  tabBarLabel: 'Summaries',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'stopwatch'}
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
      name={'cog'}
    />
  ),
}

const TabBarComponent = (props) => (<View><AudioPlayerContainer /><BottomTabBar {...props} /></View>);

export default createBottomTabNavigator({
    HomeStack,
    SummariesStack,
    SettingsStack,
  },
  {
    tabBarComponent: props => <TabBarComponent {...props} style={{ borderTopColor: '#666', backgroundColor: '#000' }} />,
    tabBarOptions: {
      showLabel: false
    }
  }
)
