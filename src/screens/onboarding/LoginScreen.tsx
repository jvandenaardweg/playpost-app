import React from 'react';
import { NavigationStackScreenOptions } from 'react-navigation';

import { LoginFormContainer } from '../../containers/LoginFormContainer';

export class LoginScreen extends React.PureComponent {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Login'
    };
  }

  render(): JSX.Element {
    return (
      <LoginFormContainer />
    );
  }
}
