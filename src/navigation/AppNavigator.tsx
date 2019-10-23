
import analytics from '@react-native-firebase/analytics';
import React, { useContext } from 'react';
import { Platform } from 'react-native';

import { createAppContainer, createSwitchNavigator, NavigationContainer, NavigationState } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createStackNavigator, NavigationStackProp } from 'react-navigation-stack';

import NavigationService from '../navigation/NavigationService';
import { MainTabNavigator, stackNavigatorDefaultNavigationOptions } from './MainTabNavigator';

import { ButtonClose } from '../components/ButtonClose';
import colors from '../constants/colors';
import { UserThemeContext } from '../contexts/UserThemeProvider';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { LoginForgotPasswordScreen } from '../screens/login/LoginForgotPasswordScreen';
import { LoginResetPasswordScreen } from '../screens/login/LoginResetPasswordScreen';
import { LogoutScreen } from '../screens/LogoutScreen';
import { ContentViewScreen } from '../screens/modals/ContentViewScreen';
import { FullAudioPlayerScreen } from '../screens/modals/FullAudioPlayerScreen';
import { UpgradeScreen } from '../screens/modals/UpgradeScreen';
import { LoginScreen } from '../screens/onboarding/LoginScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { SignupScreen } from '../screens/onboarding/SignupScreen';
import { SettingsLanguagesScreen } from '../screens/settings/LanguagesScreen';
import { SettingsVoicesScreen } from '../screens/settings/VoicesScreen';
import { SignupSuccessScreen } from '../screens/SignupSuccessScreen';

import { UserTheme } from '../reducers/user';

export interface AppNavigatorScreenProps {
  theme: UserTheme
}

const customCreateSwitchNavigator = Platform.select({
  // Because "createAnimatedSwitchNavigator" crashes on Android
  // https://github.com/react-navigation/animated-switch/issues/6
  ios: createAnimatedSwitchNavigator,
  android: createSwitchNavigator
});

const LoginStack = createStackNavigator(
  {
    login: LoginScreen,
    'login/reset-password': LoginResetPasswordScreen,
    'login/forgot-password': LoginForgotPasswordScreen
  },
  {
    initialRouteName: 'login',
    headerMode: 'screen',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation, screenProps }: { navigation: NavigationStackProp, screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme),
      headerRight: <ButtonClose theme="light" onPress={() => navigation.navigate('Onboarding')} />
    })
  }
);

const SignupStack = createStackNavigator(
  {
    Signup: SignupScreen
  },
  {
    initialRouteName: 'Signup',
    headerMode: 'screen',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation, screenProps }: { navigation: NavigationStackProp, screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme),
      headerRight: <ButtonClose theme="light" onPress={() => navigation.navigate('Onboarding')} />
    })
  }
);

const SettingsLanguagesModalStack = createStackNavigator(
  {
    SettingsLanguages: SettingsLanguagesScreen
  },
  {
    initialRouteName: 'SettingsLanguages',
    headerMode: 'none',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ screenProps }: { screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme)
    }),
  }
);

const UpgradeStack = createStackNavigator(
  {
    Upgrade: UpgradeScreen,
    ContentView: ContentViewScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation, screenProps }: { navigation: NavigationStackProp, screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme),
      headerRight: <ButtonClose theme="light" onPress={() => navigation.dismiss()} />
    })
  }
);

const ContentViewStack = createStackNavigator(
  {
    ContentView: ContentViewScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation, screenProps }: { navigation: NavigationStackProp, screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme),
      headerRight: <ButtonClose theme="light" onPress={() => navigation.dismiss()} />
    })
  }
);
const FullAudioPlayerStack = createStackNavigator(
  {
    FullAudioPlayer: FullAudioPlayerScreen
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation, screenProps }: { navigation: NavigationStackProp, screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme),
      headerRight: <ButtonClose theme="dark" onPress={() => navigation.dismiss()} />,
      headerLeft: null,
      headerStyle: {
        backgroundColor: colors.black,
        borderBottomWidth: 0
      }
    })
  }
);

const ModalLanguagesStack = createStackNavigator(
  {
    SettingsLanguages: SettingsLanguagesModalStack,
    SettingsVoices: SettingsVoicesScreen,
  },
  {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation, screenProps }: { navigation: NavigationStackProp, screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme),
      title: 'Languages',
      headerRight: <ButtonClose theme="light" onPress={() => {
        navigation.popToTop()
        navigation.dismiss()
      }} />
    })
  }
)

const OnboardingStack = createStackNavigator(
  {
    Onboarding: OnboardingScreen,
    Login: LoginStack,
    Signup: SignupStack
  },
  {
    initialRouteName: 'Onboarding',
    mode: 'modal',
    headerMode: 'screen',
    headerTransitionPreset: 'uikit',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ screenProps }: { screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme),
      header: null
    })
  }
)

const RootStack = createStackNavigator(
  {
    App: MainTabNavigator,
    Upgrade: UpgradeStack,
    ContentView: ContentViewStack,
    FullAudioPlayer: FullAudioPlayerStack,
    ModalLanguages: ModalLanguagesStack,
  },
  {
    mode: 'modal',
    initialRouteName: 'App',
    headerMode: 'none',
    defaultNavigationOptions: ({ screenProps }: { screenProps: any }) => ({
      ...stackNavigatorDefaultNavigationOptions(screenProps.theme)
    }),
  }
)

const AppNavigationContainer: NavigationContainer = createAppContainer(
  customCreateSwitchNavigator(
    {
      Root: RootStack,
      AuthLoading: AuthLoadingScreen,
      Logout: LogoutScreen,
      SignupSuccess: SignupSuccessScreen, // We place this screen outside the onboarding, so we got a nice animation to it (cross-fade)
      Onboarding: OnboardingStack
    },
    {
      initialRouteName: 'AuthLoading',
      defaultNavigationOptions: ({ screenProps }: { screenProps: any }) => ({
        ...stackNavigatorDefaultNavigationOptions(screenProps.theme)
      }),
    }
  )
);


export const AppContainer: React.FC = React.memo(() => {
  const { theme } = useContext(UserThemeContext);

  /**
   * Sets the correct screen name in our Analytics.
   *
   * From: https://reactnavigation.org/docs/en/screen-tracking.html
   */
  const handleOnNavigationStateChange = (prevState: NavigationState, currentState: NavigationState): void => {
    requestAnimationFrame(async () => {
      const currentScreenName = getActiveRouteName(currentState);
      const prevScreenName = getActiveRouteName(prevState);

      // Only set track on screen change
      if (prevScreenName !== currentScreenName && currentScreenName) {
        await analytics().setCurrentScreen(currentScreenName);
      }
    });
  };

  /**
   * Method to get the active route name from react-navigation.
   */
  const getActiveRouteName = (navigationState: NavigationState): string | null => {
    if (!navigationState) {
      return null;
    }

    const route = navigationState.routes[navigationState.index];

    // dive into nested navigators
    if (route.routes) {
      return getActiveRouteName(route);
    }

    return route.routeName;
  };

  // console.log('navigator theme: ', theme)

  return (
    <AppNavigationContainer
      ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
      // Use a custom screenProp for theme, bypassing React Navigation's own theming, which could result in weird coloring when switching themes on runtime
      screenProps={{ theme }}
      onNavigationStateChange={handleOnNavigationStateChange}
    />
  )
})

