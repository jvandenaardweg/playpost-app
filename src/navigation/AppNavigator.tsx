import { createSwitchNavigator, createAppContainer, createStackNavigator, NavigationContainer } from 'react-navigation';

import { MainTabNavigator } from './MainTabNavigator';

import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { SignupSuccessScreen } from '../screens/SignupSuccessScreen';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

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
          SignupSuccess: SignupSuccessScreen
        }
      )
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
