import React from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Keychain from 'react-native-keychain';
import { Alert } from 'react-native';

import { LoginForm } from '../components/LoginForm';

import { postAuth } from '../reducers/auth';
import { getUser } from '../reducers/user';

import { getAuthError } from '../selectors/auth';
import { getUserError } from '../selectors/user';
import { RootState } from '../reducers';

interface State {
  isLoading: boolean;
  email: string;
  password: string;
}

interface Props {
  authError: string;
  userError: string;
  getUser(): void;
  postAuth(email: string, password: string): void;
  navigation: NavigationScreenProp<NavigationRoute>;
}

class LoginScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = {
    title: 'Login'
  };

  state = {
    isLoading: false,
    email: '',
    password: ''
  };

  saveToken = async (token: string) => {
    try {
      await Keychain.setGenericPassword('token', token, { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' });
      this.props.navigation.navigate('App');
    } catch (err) {
      this.setState({ isLoading: false });
      Alert.alert('Oops!', 'We could not set you as logged in. Please try again.');
    }
  }

  handleOnPressLogin = async () => {
    const { email, password } = this.state;

    this.setState({ isLoading: true });

    try {
      /* tslint:disable no-any */
      const response: any = await this.props.postAuth(email, password);
      this.saveToken(response.payload.data.token);
    } catch (err) {
      this.setState({ isLoading: false });
      const errorMessage = (err.error.response) ? err.error.response.data.message : 'An unknown error happend. Please try again.';
      Alert.alert('Oops!', errorMessage);
    }
  }

  handleOnPressSignup = () => this.props.navigation.navigate('Signup');

  handleOnChangeText = (field: 'email' | 'password', value: string) => {
    if (field === 'email') this.setState({ email: value });
    if (field === 'password') this.setState({ password: value });
  }

  render() {
    const { email, password, isLoading } = this.state;
    const { userError, authError } = this.props;

    const error = userError || authError;

    return (
      <LoginForm
        email={email}
        password={password}
        error={error}
        isLoading={isLoading}
        onChangeText={this.handleOnChangeText}
        onPressLogin={this.handleOnPressLogin}
        onPressSignup={this.handleOnPressSignup}
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  authError: getAuthError(state),
  userError: getUserError(state)
});

const mapDispatchToProps = {
  postAuth,
  getUser
};

export const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
