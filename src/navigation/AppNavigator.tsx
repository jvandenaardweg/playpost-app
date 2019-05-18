import { createAppContainer, createStackNavigator, NavigationContainer } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

import { MainTabNavigator } from './MainTabNavigator';

import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { SignupSuccessScreen } from '../screens/SignupSuccessScreen';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ModalBrowserScreen } from '../screens/ModalBrowserScreen';
import { UpgradeScreen } from '../screens/UpgradeScreen';
import { LogoutScreen } from '../screens/LogoutScreen';

export const AppNavigator: NavigationContainer = createAppContainer(
  createAnimatedSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Logout: LogoutScreen,
      SignupSuccess: SignupSuccessScreen, // We place this screen outside the onboarding, so we got a nice animation to it (cross-fade)
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
      Onboarding: createStackNavigator(
        {
          Onboarding: OnboardingScreen,
          Login: LoginScreen,
          Signup: SignupScreen,
          ModalBrowser: ModalBrowserScreen,
        },
        {
          initialRouteName: 'Onboarding',
          mode: 'modal',
          headerMode: 'screen'
        }
      )
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
