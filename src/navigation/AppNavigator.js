import { createSwitchNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import { MainTabNavigator } from './MainTabNavigator';

import { LoginScreen } from '@/screens/LoginScreen';
import { SignupScreen } from '@/screens/SignupScreen';
import { AuthLoadingScreen } from '@/screens/AuthLoadingScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';

const OnboardingStack = createStackNavigator({ Onboarding: OnboardingScreen, Login: LoginScreen, Signup: SignupScreen });

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: MainTabNavigator,
    Onboarding: OnboardingStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

export default createAppContainer(AppNavigator);
