import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import { TabBar, TabBarIcon } from '@/components/TabBar';

import { PlaylistScreen } from '@/screens/PlaylistScreen';
import { ArchiveScreen } from '@/screens/ArchiveScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const PlaylistStack = createStackNavigator(
  {
    Playlist: PlaylistScreen,
  },
  {
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

const ArchiveStack = createStackNavigator(
  {
    Archive: ArchiveScreen
  },
  {
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


const FavoritesStack = createStackNavigator(
  {
    Favorites: FavoritesScreen
  },
  {
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

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  {
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name="settings"
        />
      ),
    }
  }
);

export const MainTabNavigator = createBottomTabNavigator({
  PlaylistStack,
  ArchiveStack,
  FavoritesStack,
  SettingsStack,
},
{
  tabBarComponent: props => <TabBar {...props} />,
  tabBarOptions: {
    showLabel: false
  }
});
