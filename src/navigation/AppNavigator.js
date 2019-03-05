import { createSwitchNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import { MainTabNavigator } from './MainTabNavigator';

import { LoginScreen } from '@/screens/LoginScreen';
import { SignupScreen } from '@/screens/SignupScreen';
import { AuthLoadingScreen } from '@/screens/AuthLoadingScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';

const LoginStack = createStackNavigator({ Login: LoginScreen });
const SignupStack = createStackNavigator({ Signup: SignupScreen });
const OnboardingStack = createStackNavigator({ Onboarding: OnboardingScreen });

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: MainTabNavigator,
    Login: LoginStack, // https://reactnavigation.org/docs/en/auth-flow.html
    Signup: SignupStack,
    Onboarding: OnboardingStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

export default createAppContainer(AppNavigator);
