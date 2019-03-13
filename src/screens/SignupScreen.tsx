import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import { SignupForm } from '../components/SignupForm';

import { createUser, UserState } from '../reducers/user';
import { postAuth, AuthState } from '../reducers/auth';

import { getAuthError } from '../selectors/auth';
import { getUserError } from '../selectors/user';

interface State {
  isLoading: boolean;
  email: string | null;
  password: string | null;
  passwordValidation: string | null;
  validationError: string | null;
}

interface Props {
  authError: string | null;
  userError: string | null;
  postAuth: (email: string, password: string) => {};
  createUser: (email: string, password: string) => {};
  navigation: NavigationScreenProp<NavigationRoute>;
}

class SignupScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = {
    title: 'Signup'
  };

  state = {
    isLoading: false,
    email: '',
    password: '',
    passwordValidation: '',
    validationError: ''
  };

  /**
   * Saves the token in our secure storage and redirects to user to the success page
   */
  saveToken = async (token: string) => {
    try {
      await Keychain.setGenericPassword('token', token, { accessGroup: 'group.readto', service: 'com.aardwegmedia.readtoapp' });
      this.props.navigation.navigate('SignupSuccess');
    } catch (err) {
      Alert.alert('Oops!', 'We have successfully created your account, but could not log you in. Please try logging in manually.');
      this.setState({ isLoading: false });
    }
  }

  /**
   * Automatically logs the user in by using their given email and password
   * Providing some ease of use
   */
  autoLogin = async () => {
    const { email, password } = this.state;

    try {
      const response: any = await this.props.postAuth(email, password);
      this.saveToken(response.payload.data.token);
    } catch (err) {
      const errorMessage = (err.error.response) ? err.error.response.data.message : 'An error happened while creating your account. Please try again.';
      Alert.alert('Oops!', errorMessage);
      this.setState({ isLoading: false });
    }
  }

  handleOnPressSignup = async () => {
    const { email, password, passwordValidation } = this.state;

    if (password !== passwordValidation) {
      return this.setState({ validationError: 'The given passwords do not match. Please make sure you typed your passwords correctly.' });
    }

    this.setState({ isLoading: true });

    try {
      await this.props.createUser(email, password);
      this.autoLogin();
    } catch (err) {
      const errorMessage = (err.error.response) ? err.error.response.data.message : 'An unknown error happend. Please try again.';
      Alert.alert('Oops!', errorMessage);
      this.setState({ isLoading: false });
    }
  }

  handleOnPressLogin = () => this.props.navigation.navigate('Login');

  handleOnChangeText = (field: 'email' | 'password', value: string) => this.setState<any>({ [field]: value });

  render() {
    const { email, password, passwordValidation, validationError, isLoading } = this.state;
    const { userError, authError } = this.props;

    const error = userError || authError || validationError;

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
  authError: getAuthError(state),
  userError: getUserError(state)
});

const mapDispatchToProps = {
  createUser,
  postAuth
};

export const SignupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupScreenContainer);
