import { createSwitchNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import { MainTabNavigator } from '@/navigation/MainTabNavigator';

import { LoginScreen } from '@/screens/LoginScreen';
import { SignupScreen } from '@/screens/SignupScreen';
import { AuthLoadingScreen } from '@/screens/AuthLoadingScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';

export const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MainTabNavigator,
      Onboarding: createStackNavigator(
        {
          Onboarding: OnboardingScreen,
          Login: LoginScreen,
          Signup: SignupScreen
        }
      )
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
