import React from 'react';
import { NavigationStackScreenOptions } from 'react-navigation';

import { SignupFormContainer } from '../../containers/SignupFormContainer';

export class SignupScreen extends React.PureComponent {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Signup'
    };
  }

  render() {
    return (
      <SignupFormContainer />
    );
  }
}
