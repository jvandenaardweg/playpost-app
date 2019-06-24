import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import { LoginUpdatePasswordFormContainer } from '../../containers/LoginUpdatePasswordFormContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class LoginUpdatePasswordScreen extends React.PureComponent<Props> {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Update your password',
      // header: null
    };
  }

  render() {
    return (
      <LoginUpdatePasswordFormContainer />
    );
  }
}
