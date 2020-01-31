import memoize from 'fast-memoize';
import React from 'react';
import { createStackNavigator, NavigationStackOptions, HeaderStyleInterpolators } from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBarProps } from 'react-navigation-tabs';

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

import colors from '../constants/colors';
import { UserTheme } from '../reducers/user';

export const stackNavigatorDefaultNavigationOptions = memoize((theme: UserTheme): NavigationStackOptions => {
  return {
    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
    headerTitleAlign: 'center',
    headerStyle: {
      borderBottomColor: theme === 'dark' ? colors.gray600 : colors.grayLight,
      backgroundColor: theme === 'dark' ? colors.gray800 : colors.white,
    },
    headerTitleStyle: {
      ...textPresets.bodyEmphasized,
      color: theme === 'dark' ? colors.white : colors.black,
    },
    headerTintColor: theme === 'dark' ? colors.white : colors.tintColor,
    headerBackTitleStyle: {
      ...textPresets.body,
      color: theme === 'dark' ? colors.white : colors.tintColor,
    },
  }
})

const PlaylistStack = createStackNavigator(
  {
    Playlist: PlaylistScreen,
    FullArticle: FullArticleScreen
  },
  {
    headerMode: 'float',
    defaultNavigationOptions: ({ screenProps }: { screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme)
    }),
    navigationOptions: () => ({
      tabBarLabel: 'Playlist',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <TabBarIcon
          focused={focused}
          name="headphones"
        />
      )
    })
  }
);

const ArchiveStack = createStackNavigator(
  {
    Archive: ArchiveScreen
  },
  {
    headerMode: 'float',
    defaultNavigationOptions: ({ screenProps }: { screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme)
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
    defaultNavigationOptions: ({ screenProps }: { screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme)
    }),
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
    defaultNavigationOptions: ({ screenProps }: { screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme)
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
    tabBarComponent: (props: BottomTabBarProps) => <TabBar {...props} />,
    tabBarOptions: {
      showLabel: false
    }
  }
);
