import React from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { SignupFormContainer } from '../../containers/SignupFormContainer';
import colors from '../../constants/colors';

export const SignupScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <SignupFormContainer />
    </SafeAreaView>
  )
})

SignupScreen.navigationOptions = (): NavigationStackOptions => {
  return {
    title: 'Create new account'
  };
}
