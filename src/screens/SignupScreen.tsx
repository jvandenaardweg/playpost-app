import React from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import { createUser, UserState } from '../reducers/user';
import { postAuth, AuthState } from '../reducers/auth';

import { SignupForm } from '../components/SignupForm';

interface State {
  email?: string;
  password?: string;
  passwordValidation?: string;
  validationError?: string;
}

interface Props {
  auth: AuthState;
  user: UserState;
  postAuth: (email: string, password: string) => {};
  createUser: (email: string, password: string) => {};
  navigation: NavigationScreenProp<NavigationRoute>;
}

class SignupScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = {
    title: 'Signup'
  };

  state = {
    email: '',
    password: '',
    passwordValidation: '',
    validationError: ''
  };

  async componentDidUpdate() {
    const { email, password } = this.state;
    const { token, isLoading } = this.props.auth;
    const { user } = this.props.user;

    // Automatically log the user in on a successful signup
    if (!isLoading && !token && (user && user.id)) {
      await this.props.postAuth(email, password);
    }

    if (token) {
      await Keychain.setGenericPassword('token', token, { accessGroup: 'group.readto', service: 'com.aardwegmedia.readtoapp' });
      this.props.navigation.navigate('SignupSuccess');
    }
  }

  handleOnPressSignup = () => {
    const { email, password, passwordValidation } = this.state;

    if (password !== passwordValidation) {
      return this.setState({ validationError: 'The given passwords do not match. Please make sure you typed your passwords correctly.' });
    }

    return this.props.createUser(email, password);
  }

  handleOnPressLogin = () => this.props.navigation.navigate('Login');

  handleOnChangeText = (field: string, value: string) => this.setState({ [field]: value });

  render() {
    const { email, password, passwordValidation, validationError } = this.state;
    const error = this.props.auth.error || this.props.user.error || validationError;

    // A way to keep showing loading untill we navigate
    // Or when an error happens
    let isLoading = this.props.auth.isLoading || this.props.user.isLoading;

    // TODO: loading goes away if the user has an error, so this might not be a good way

    if (error) {
      isLoading = false;
    }

    return (
      <SignupForm
        email={email}
        password={password}
        passwordValidation={passwordValidation}
        error={error}
        validationError={validationError}
        isLoading={isLoading}
        onChangeText={this.handleOnChangeText}
        onPressLogin={this.handleOnPressLogin}
        onPressSignup={this.handleOnPressSignup}
      />
    );
  }
}

const mapStateToProps = (state: { user: UserState, auth: AuthState }) => ({
  user: state.user,
  auth: state.auth
});

const mapDispatchToProps = {
  createUser,
  postAuth
};

export const SignupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupScreenContainer);
