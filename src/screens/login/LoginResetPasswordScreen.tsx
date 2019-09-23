import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions, SafeAreaView } from 'react-navigation';
import { LoginResetPasswordFormContainer } from '../../containers/LoginResetPasswordFormContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class LoginResetPasswordScreen extends React.PureComponent<Props> {
  static navigationOptions = (): NavigationStackScreenOptions => {
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
