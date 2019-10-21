
import analytics from '@react-native-firebase/analytics';
import React, { useContext } from 'react';
import { Platform } from 'react-native';

import { createAppContainer, createSwitchNavigator, NavigationContainer, NavigationState } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createStackNavigator } from 'react-navigation-stack';

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
    defaultNavigationOptions: ({ navigation, theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'login'),
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
    defaultNavigationOptions: ({ navigation, theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'signup'),
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
    defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'settingslanguages')
    })
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
    defaultNavigationOptions: ({ navigation, theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'upgrade'),
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
    defaultNavigationOptions: ({ navigation, theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'contentview'),
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
    defaultNavigationOptions: ({ navigation, theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'full audio'),
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
    defaultNavigationOptions: ({ navigation, theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'modal languages'),
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
    defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'onboarding'),
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
    defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'root')
    })
  }
)

const AppNavigationContainer: NavigationContainer = createAppContainer(
  createSwitchNavigator(
    {
      Root: RootStack,
      AuthLoading: AuthLoadingScreen,
      Logout: LogoutScreen,
      SignupSuccess: SignupSuccessScreen, // We place this screen outside the onboarding, so we got a nice animation to it (cross-fade)
      Onboarding: OnboardingStack
    },
    {
      initialRouteName: 'AuthLoading',
      defaultNavigationOptions: ({ theme }) => ({
      ...stackNavigatorDefaultNavigationOptions(theme, 'AppNavigationContainer')
    })
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
      screenProps={theme === UserTheme.dark ? 'dark' : 'light'}
      theme={theme === UserTheme.dark ? 'dark' : 'light'}
      onNavigationStateChange={handleOnNavigationStateChange}
    />
  )
})

