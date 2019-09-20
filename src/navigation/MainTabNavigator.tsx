import React from 'react';
import { BottomTabBarProps, BottomTabNavigatorConfig, createBottomTabNavigator, createStackNavigator, NavigationScreenOptions, StackNavigatorConfig } from 'react-navigation';

import { TabBar } from '../components/TabBar';
import { TabBarIcon } from '../components/TabBarIcon';

import { ArchiveScreen } from '../screens/ArchiveScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { FullArticleScreen } from '../screens/FullArticleScreen';
import { PlaylistScreen } from '../screens/PlaylistScreen';
import { SettingsLanguagesScreen } from '../screens/settings/LanguagesScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { UpdateEmailScreen } from '../screens/settings/UpdateEmailScreen';
import { UpdatePasswordScreen } from '../screens/settings/UpdatePasswordScreen';
import { SettingsVoicesScreen } from '../screens/settings/VoicesScreen';

import { ButtonVoices } from '../components/ButtonVoices';
import { textPresets } from '../components/Text';
import colors from '../constants/colors';
import { ButtonUpgradeContainer } from '../containers/ButtonUpgradeContainer';


export const stackNavigatorDefaultNavigationOptions: NavigationScreenOptions = {
  headerStyle: {
    borderBottomColor: colors.borderDefault
  },
  headerTitleStyle: {
    ...textPresets['bodyEmphasized']
  },
  headerBackTitleStyle: {
    ...textPresets['body'],
    color: colors.tintColor
  }
}

const PlaylistStack: StackNavigatorConfig = createStackNavigator(
  {
    Playlist: PlaylistScreen,
    FullArticle: FullArticleScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation }) => ({
      ...stackNavigatorDefaultNavigationOptions
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
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation }) => ({
      ...stackNavigatorDefaultNavigationOptions,
      title: 'Archive',
      headerRight: <ButtonUpgradeContainer />,
      headerLeft: <ButtonVoices onPress={() => requestAnimationFrame(() => navigation.navigate('ModalLanguages'))} />
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
      ...stackNavigatorDefaultNavigationOptions,
      title: 'Favorites',
      headerRight: <ButtonUpgradeContainer />,
      headerLeft: <ButtonVoices onPress={() => requestAnimationFrame(() => navigation.navigate('ModalLanguages'))} />
    }),
    headerLayoutPreset: 'center',
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
    UpdatePassword: UpdatePasswordScreen,
    UpdateEmail: UpdateEmailScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation }) => ({
      ...stackNavigatorDefaultNavigationOptions,
      title: 'Settings'
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
    // lazy: false, // pre-render all screens
    tabBarComponent: (props: BottomTabBarProps) => <TabBar {...props} />,
    tabBarOptions: {
      showLabel: false
    },
  }
);
