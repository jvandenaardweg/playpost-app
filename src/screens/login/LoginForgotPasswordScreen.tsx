import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import { LoginForgotPasswordFormContainer } from '../../containers/LoginForgotPasswordFormContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class LoginForgotPasswordScreen extends React.PureComponent<Props> {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Forgot your password?',
      // header: null
    };
  }

  render() {
    return (
      <LoginForgotPasswordFormContainer />
    );
  }
}
