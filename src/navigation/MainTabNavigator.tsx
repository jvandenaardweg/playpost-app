import React from 'react';
import { createStackNavigator, createBottomTabNavigator, StackNavigatorConfig, BottomTabNavigatorConfig, BottomTabBarProps } from 'react-navigation';

import { TabBar, TabBarIcon } from '../components/TabBar';

import { PlaylistScreen } from '../screens/PlaylistScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { BrowserScreen } from '../screens/BrowserScreen';
import { SettingsVoicesScreen } from '../screens/SettingsVoicesScreen';
import { FullArticleScreen } from '../screens/FullArticleScreen';

const PlaylistStack: StackNavigatorConfig = createStackNavigator(
  {
    Playlist: PlaylistScreen,
    Browser: BrowserScreen,
    FullArticle: FullArticleScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
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
    Browser: BrowserScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name="settings"
        />
      ),
    },

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
