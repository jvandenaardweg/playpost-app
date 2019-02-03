import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import ProjectsIndexScreen from '../screens/projects/ProjectsIndexScreen'
import ProjectsDetailScreen from '../screens/projects/ProjectsDetailScreen'
import OrganizationsScreen from '../screens/OrganizationsScreen'
import MessagesScreen from '../screens/MessagesScreen'
import SettingsScreen from '../screens/SettingsScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'home'}
    />
  ),
}

const ProjectsStack = createStackNavigator({
  ProjectsIndex: ProjectsIndexScreen,
  ProjectsDetail: ProjectsDetailScreen
})

ProjectsStack.navigationOptions = {
  tabBarLabel: 'Projects',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'clipboard-list'}
    />
  ),
}

const OrganizationsStack = createStackNavigator({
  Organizations: OrganizationsScreen,
})

OrganizationsStack.navigationOptions = {
  tabBarLabel: 'Organizations',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'user-tie'}
    />
  ),
}

const MessagesStack = createStackNavigator({
  Messages: MessagesScreen,
})

MessagesStack.navigationOptions = {
  tabBarLabel: 'Messages',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'headphones'}
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
      name={'list-ol'}
    />
  ),
}

export default createBottomTabNavigator({
  HomeStack,
  ProjectsStack,
  OrganizationsStack,
  MessagesStack,
  SettingsStack,
}, {
  tabBarOptions: {
    showLabel: false
  }
})
