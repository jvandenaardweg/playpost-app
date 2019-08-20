import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { LoginResetPasswordFormContainer } from '../../containers/LoginResetPasswordFormContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class LoginResetPasswordScreen extends React.PureComponent<Props> {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Reset your password',
      // header: null
    };
  }

  render() {
    return (
      <LoginResetPasswordFormContainer />
    );
  }
}
