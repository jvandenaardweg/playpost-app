
import React from 'react';

import { createAppContainer, createStackNavigator, NavigationContainer } from 'react-navigation';
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
              headerMode: 'screen'
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
