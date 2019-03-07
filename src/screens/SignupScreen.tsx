import React from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { createUser } from '../reducers/users';
import { postAuth } from '../reducers/auth';

import { SignupForm } from '../components/SignupForm';

interface State {
  email?: string
  password?: string
  passwordValidation?: string
  validationError?: string
}

interface Props {
  auth: any
  users: any
  postAuth: (email: string, password: string) => {}
  createUser: (email: string, password: string) => {}
  navigation: NavigationScreenProp<NavigationRoute>
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
  }

  async componentDidUpdate() {
    const { email, password } = this.state;
    const { token, isLoading } = this.props.auth;
    const { user } = this.props.users;

    // Automatically log the user in on a successful signup
    if (!isLoading && !token && user.id) {
      this.props.postAuth(email, password);
    }

    if (token) {
      await AsyncStorage.setItem('userToken', token);
      this.props.navigation.navigate('App');
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
    const error = this.props.auth.error || this.props.users.error || validationError;

    // A way to keep showing loading untill we navigate
    // Or when an error happens
    let isLoading = this.props.auth.isLoading || this.props.users.isLoading;

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

const mapStateToProps = ({ users, auth }) => ({
  users,
  auth
});

const mapDispatchToProps = {
  createUser,
  postAuth
};

export const SignupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupScreenContainer);
