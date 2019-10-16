import React from 'react';
import { createStackNavigator, NavigationStackOptions } from 'react-navigation-stack';
import { createBottomTabNavigator, NavigationTabProp } from 'react-navigation-tabs';

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
import { SettingsThemesScreen } from '../screens/settings/ThemesScreen';


export const stackNavigatorDefaultNavigationOptions: NavigationStackOptions = {
  headerStyle: {
    borderBottomColor: '#333333',
    backgroundColor: '#1E1E1E'
  },
  headerTitleStyle: {
    ...textPresets['bodyEmphasized'],
    color: colors.black
  },
  headerBackTitleStyle: {
    ...textPresets['body'],
    color: colors.tintColor
  }
}

const PlaylistStack = createStackNavigator(
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
      tabBarIcon: ({ focused }: { focused: boolean }) => (
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
      tabBarIcon: ({ focused }: { focused: boolean }) => (
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
      tabBarIcon: ({ focused }: { focused: boolean }) => (
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
    Settings: SettingsScreen,
    SettingsVoices: SettingsVoicesScreen,
    SettingsLanguages: SettingsLanguagesScreen,
    SettingsTheme: SettingsThemesScreen,
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
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <TabBarIcon
          focused={focused}
          name="settings"
        />
      )
    })
  }
);

export const MainTabNavigator = createBottomTabNavigator(
  {
    PlaylistStack,
    ArchiveStack,
    FavoritesStack,
    SettingsStack,
  },
  {
    // lazy: false, // pre-render all screens
    tabBarComponent: (props: NavigationTabProp) => <TabBar {...props} />,
    tabBarOptions: {
      showLabel: false
    }
  }
);
