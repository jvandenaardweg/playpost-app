import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationRoute, NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { LoginResetPasswordFormContainer } from '../../containers/LoginResetPasswordFormContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class LoginResetPasswordScreen extends React.PureComponent<Props> {
  static navigationOptions = (): NavigationStackOptions => {
    return {
      title: 'Reset your password'
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <LoginResetPasswordFormContainer />
      </SafeAreaView>

    );
  }
}
