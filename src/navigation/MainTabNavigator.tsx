import memoize from 'fast-memoize';
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
import { SettingsThemesScreen } from '../screens/settings/ThemesScreen';
import { UpdateEmailScreen } from '../screens/settings/UpdateEmailScreen';
import { UpdatePasswordScreen } from '../screens/settings/UpdatePasswordScreen';
import { SettingsVoicesScreen } from '../screens/settings/VoicesScreen';

import { textPresets } from '../components/Text';

import { SupportedThemes } from 'react-navigation';
import colors from '../constants/colors';


export const stackNavigatorDefaultNavigationOptions = memoize((theme: SupportedThemes): NavigationStackOptions => {
  return {
    headerStyle: {
      borderBottomColor: theme === 'dark' ? colors.gray600 : colors.grayLight,
      backgroundColor: theme === 'dark' ? colors.gray800 : colors.white,
    },
    headerTitleStyle: {
      ...textPresets['bodyEmphasized'],
      color: theme === 'dark' ? colors.white : colors.black,
    },
    headerTintColor: theme === 'dark' ? colors.white : colors.tintColor,
    headerBackTitleStyle: {
      ...textPresets['body'],
      color: theme === 'dark' ? colors.white : colors.tintColor,
    }
  }
})

const PlaylistStack = createStackNavigator(
  {
    Playlist: PlaylistScreen,
    FullArticle: FullArticleScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme)
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
    defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme),
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
    defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme),
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
    defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme),
    }),
    navigationOptions: () => ({
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
    },
    defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme)
    })
  }
);
