import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions, SafeAreaView } from 'react-navigation';
import { LoginForgotPasswordFormContainer } from '../../containers/LoginForgotPasswordFormContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class LoginForgotPasswordScreen extends React.PureComponent<Props> {
  static navigationOptions = (): NavigationStackScreenOptions => {
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
