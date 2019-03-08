import * as React from 'React';
import { createStackNavigator, createBottomTabNavigator, StackNavigatorConfig, BottomTabNavigatorConfig } from 'react-navigation';

import { TabBar, TabBarIcon } from '../components/TabBar';

import { PlaylistScreen } from '../screens/PlaylistScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const PlaylistStack: StackNavigatorConfig = createStackNavigator(
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

const ArchiveStack: StackNavigatorConfig = createStackNavigator(
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

const FavoritesStack: StackNavigatorConfig = createStackNavigator(
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

const SettingsStack: StackNavigatorConfig = createStackNavigator(
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

export const MainTabNavigator: BottomTabNavigatorConfig = createBottomTabNavigator(
  {
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
  }
);
