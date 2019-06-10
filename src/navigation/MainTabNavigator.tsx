import React from 'react';
import { createStackNavigator, createBottomTabNavigator, StackNavigatorConfig, BottomTabNavigatorConfig, BottomTabBarProps } from 'react-navigation';

import { TabBar } from '../components/TabBar';
import { TabBarIcon } from '../components/TabBarIcon';

import { PlaylistScreen } from '../screens/PlaylistScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { BrowserScreen } from '../screens/BrowserScreen';
import { SettingsVoicesScreen } from '../screens/settings/VoicesScreen';
import { SettingsLanguagesScreen } from '../screens/settings/LanguagesScreen';
import { FullArticleScreen } from '../screens/FullArticleScreen';
import { UpdatePasswordScreen } from '../screens/settings/UpdatePasswordScreen';
import { UpdateEmailScreen } from '../screens/settings/UpdateEmailScreen';
import { ButtonUpgrade } from '../components/ButtonUpgrade';

const PlaylistStack: StackNavigatorConfig = createStackNavigator(
  {
    Playlist: PlaylistScreen,
    FullArticle: FullArticleScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Playlist',
      headerRight: <ButtonUpgrade onPress={() => navigation.navigate('Upgrade')} />
    }),
    navigationOptions: {
      tabBarLabel: 'Playlist',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name="headphones"
        />
      ),
    }
  }
);

const ArchiveStack: StackNavigatorConfig = createStackNavigator(
  {
    Archive: ArchiveScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Archive',
      headerRight: <ButtonUpgrade onPress={() => navigation.navigate('Upgrade')} />
    }),
    navigationOptions: {
      tabBarLabel: 'Archive',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name="archive"
        />
      ),
    }
  }
);

const FavoritesStack: StackNavigatorConfig = createStackNavigator(
  {
    Favorites: FavoritesScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Favorites',
      headerRight: <ButtonUpgrade onPress={() => navigation.navigate('Upgrade')} />
    }),
    navigationOptions: {
      tabBarLabel: 'Favorites',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name="heart"
        />
      ),
    }
  }
);

const SettingsStack: StackNavigatorConfig = createStackNavigator(
  {
    Settings: SettingsScreen,
    SettingsVoices: SettingsVoicesScreen,
    SettingsLanguages: SettingsLanguagesScreen,
    Browser: BrowserScreen,
    UpdatePassword: UpdatePasswordScreen,
    UpdateEmail: UpdateEmailScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Settings',
      headerRight: <ButtonUpgrade onPress={() => navigation.navigate('Upgrade')} />
    }),
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name="settings"
        />
      )
    }
  }
);

export const MainTabNavigator: BottomTabNavigatorConfig = createBottomTabNavigator(
  {
    PlaylistStack,
    ArchiveStack,
    FavoritesStack,
    SettingsStack,
  },
  {
    tabBarComponent: (props: BottomTabBarProps) => <TabBar {...props} />,
    tabBarOptions: {
      showLabel: false
    },
  }
);
