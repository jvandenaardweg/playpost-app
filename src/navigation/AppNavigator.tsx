
import React from 'react';
import { Platform } from 'react-native';

import { createAppContainer, createStackNavigator, createSwitchNavigator, NavigationContainer } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

import { MainTabNavigator } from './MainTabNavigator';

import { ButtonClose } from '../components/ButtonClose';
import colors from '../constants/colors';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { LoginForgotPasswordScreen } from '../screens/login/LoginForgotPasswordScreen';
import { LoginResetPasswordScreen } from '../screens/login/LoginResetPasswordScreen';
import { LogoutScreen } from '../screens/LogoutScreen';
import { ContentViewScreen } from '../screens/modals/ContentViewScreen';
import { UpgradeScreen } from '../screens/modals/UpgradeScreen';
import { LoginScreen } from '../screens/onboarding/LoginScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { SignupScreen } from '../screens/onboarding/SignupScreen';
import { SettingsLanguagesScreen } from '../screens/settings/LanguagesScreen';
import { SettingsVoicesScreen } from '../screens/settings/VoicesScreen';
import { SignupSuccessScreen } from '../screens/SignupSuccessScreen';

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
    defaultNavigationOptions: ({ navigation }) => ({
      headerRight: <ButtonClose onPress={() => navigation.navigate('Onboarding')} />,
      headerStyle: {
        borderBottomColor: colors.borderDefault
      }
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
    defaultNavigationOptions: ({ navigation }) => ({
      headerRight: <ButtonClose onPress={() => navigation.navigate('Onboarding')} />,
      headerStyle: {
        borderBottomColor: colors.borderDefault
      }
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
  }
);

export const AppNavigator: NavigationContainer = createAppContainer(
  customCreateSwitchNavigator(
    {
      Root: createStackNavigator(
        {
          App: MainTabNavigator,
          Modals: createStackNavigator(
            {
              Upgrade: UpgradeScreen,
              ContentView: ContentViewScreen
            },
            {
              headerMode: 'float',
              headerTransitionPreset: 'uikit',
              defaultNavigationOptions: ({ navigation }) => ({
                headerRight: <ButtonClose onPress={() => navigation.dismiss()} />,
                headerStyle: {
                  borderBottomColor: colors.borderDefault
                }
              })
            }
          ),
          ModalLanguages: createStackNavigator(
            {
              SettingsLanguages: SettingsLanguagesModalStack,
              SettingsVoices: SettingsVoicesScreen,
            },
            {
              headerMode: 'float',
              headerTransitionPreset: 'uikit',
              defaultNavigationOptions: ({ navigation }) => ({
                title: 'Languages',
                headerRight: <ButtonClose onPress={() => {
                  navigation.popToTop()
                  navigation.dismiss()
                }} />,
                headerStyle: {
                  borderBottomColor: colors.borderDefault
                }
              })
            }
          )
        },
        {
          mode: 'modal',
          initialRouteName: 'App',
          headerMode: 'none'
        }
      ),
      AuthLoading: AuthLoadingScreen,
      Logout: LogoutScreen,
      SignupSuccess: SignupSuccessScreen, // We place this screen outside the onboarding, so we got a nice animation to it (cross-fade)
      Onboarding: createStackNavigator(
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
          defaultNavigationOptions: {
            header: null,
          }
        }
      )
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
