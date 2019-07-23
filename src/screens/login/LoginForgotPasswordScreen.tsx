import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { LoginForgotPasswordFormContainer } from '../../containers/LoginForgotPasswordFormContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class LoginForgotPasswordScreen extends React.PureComponent<Props> {
  public static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Forgot your password?',
      // header: null
    };
  }

  public render(): JSX.Element {
    return (
      <LoginForgotPasswordFormContainer />
    );
  }
}
