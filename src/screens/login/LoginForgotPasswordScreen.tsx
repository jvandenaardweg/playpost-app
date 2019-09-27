import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationRoute, NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';
import { LoginForgotPasswordFormContainer } from '../../containers/LoginForgotPasswordFormContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class LoginForgotPasswordScreen extends React.PureComponent<Props> {
  static navigationOptions = (): NavigationStackOptions => {
    return {
      title: 'Forgot password?'
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <LoginForgotPasswordFormContainer />
      </SafeAreaView>
    );
  }
}
