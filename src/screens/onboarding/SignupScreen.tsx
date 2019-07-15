import React from 'react';
import { NavigationStackScreenOptions } from 'react-navigation';

import { SignupFormContainer } from '../../containers/SignupFormContainer';

export class SignupScreen extends React.PureComponent {
  public static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Signup'
    };
  }

  public render() {
    return (
      <SignupFormContainer />
    );
  }
}
