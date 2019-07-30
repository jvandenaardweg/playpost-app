import React from 'react';
import { BottomTabBarProps, BottomTabNavigatorConfig, createBottomTabNavigator, createStackNavigator, StackNavigatorConfig } from 'react-navigation';

import { TabBar } from '../components/TabBar';
import { TabBarIcon } from '../components/TabBarIcon';

import { ArchiveScreen } from '../screens/ArchiveScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { FullArticleScreen } from '../screens/FullArticleScreen';
import { PlaylistScreen } from '../screens/PlaylistScreen';
import { BrowserScreen } from '../screens/settings/BrowserScreen';
import { SettingsLanguagesScreen } from '../screens/settings/LanguagesScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { UpdateEmailScreen } from '../screens/settings/UpdateEmailScreen';
import { UpdatePasswordScreen } from '../screens/settings/UpdatePasswordScreen';
import { SettingsVoicesScreen } from '../screens/settings/VoicesScreen';

import { ButtonVoices } from '../components/ButtonVoices';
import colors from '../constants/colors';
import { ButtonUpgradeContainer } from '../containers/ButtonUpgradeContainer';

const PlaylistStack: StackNavigatorConfig = createStackNavigator(
  {
    Playlist: PlaylistScreen,
    FullArticle: FullArticleScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    defaultNavigationOptions: ({ navigation }) => ({
      headerRight: <ButtonUpgradeContainer />,
      headerStyle: {
        borderBottomColor: colors.borderDefault
      }
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
      headerRight: <ButtonUpgradeContainer />,
      headerLeft: <ButtonVoices onPress={() => navigation.navigate('ModalLanguages')} />,
      headerStyle: {
        borderBottomColor: colors.borderDefault
      }
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
      headerRight: <ButtonUpgradeContainer />,
      headerLeft: <ButtonVoices onPress={() => navigation.navigate('ModalLanguages')} />,
      headerStyle: {
        borderBottomColor: colors.borderDefault
      }
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
      headerRight: <ButtonUpgradeContainer />,
      headerStyle: {
        borderBottomColor: colors.borderDefault
      }
    }),
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: 'Settings',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name="settings"
        />
      )
    })
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
