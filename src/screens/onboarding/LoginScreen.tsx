import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationStackOptions } from 'react-navigation-stack';

import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { LoginFormContainer } from '../../containers/LoginFormContainer';

export const LoginScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginFormContainer />
    </SafeAreaView>
  );
})

LoginScreen.navigationOptions = (): NavigationStackOptions => {
  return {
    title: 'Login',
  };
}
