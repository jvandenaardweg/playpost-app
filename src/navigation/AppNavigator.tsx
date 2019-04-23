import { createSwitchNavigator, createAppContainer, createStackNavigator, NavigationContainer } from 'react-navigation';

import { MainTabNavigator } from './MainTabNavigator';

import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { SignupSuccessScreen } from '../screens/SignupSuccessScreen';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ModalBrowserScreen } from '../screens/ModalBrowserScreen';

export const AppNavigator: NavigationContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MainTabNavigator,
      Onboarding: createStackNavigator(
        {
          Onboarding: OnboardingScreen,
          Login: LoginScreen,
          Signup: SignupScreen,
          SignupSuccess: SignupSuccessScreen,
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
