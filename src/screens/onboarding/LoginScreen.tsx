import React from 'react';
import { NavigationStackScreenOptions } from 'react-navigation';

import { LoginFormContainer } from '../../containers/LoginFormContainer';

export class LoginScreen extends React.PureComponent {
  public static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Login'
    };
  }

  public render() {
    return (
      <LoginFormContainer />
    );
  }
}
