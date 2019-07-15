
import React from 'react';

import { createAppContainer, createStackNavigator, NavigationContainer, NavigationActions } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

import { MainTabNavigator } from './MainTabNavigator';

import { LoginScreen } from '../screens/onboarding/LoginScreen';
import { LoginResetPasswordScreen } from '../screens/login/LoginResetPasswordScreen';
import { SignupScreen } from '../screens/onboarding/SignupScreen';
import { SignupSuccessScreen } from '../screens/SignupSuccessScreen';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { UpgradeScreen } from '../screens/modals/UpgradeScreen';
import { LogoutScreen } from '../screens/LogoutScreen';
import { ButtonClose } from '../components/ButtonClose';
import { LoginForgotPasswordScreen } from '../screens/login/LoginForgotPasswordScreen';
import { SettingsLanguagesScreen } from '../screens/settings/LanguagesScreen';
import { SettingsVoicesScreen } from '../screens/settings/VoicesScreen';

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
      headerRight: <ButtonClose onPress={() => navigation.navigate('Onboarding')} />
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
      headerRight: <ButtonClose onPress={() => navigation.navigate('Onboarding')} />
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
  createAnimatedSwitchNavigator(
    {
      Root: createStackNavigator(
        {
          App: MainTabNavigator,
          Modals: createStackNavigator(
            {
              Upgrade: UpgradeScreen
            },
            {
              headerMode: 'float',
              headerTransitionPreset: 'uikit',
              defaultNavigationOptions: ({ navigation }) => ({
                headerRight: <ButtonClose onPress={() => navigation.dismiss()} />
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
                }} />
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
