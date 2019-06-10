import React from 'react';
import { connect } from 'react-redux';
import { Alert, Platform } from 'react-native';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import * as Keychain from 'react-native-keychain';

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

import { SignupForm } from '../components/SignupForm';

import { createUser } from '../reducers/user';
import { postAuth } from '../reducers/auth';

import { selectAuthError } from '../selectors/auth';
import { selectUserError } from '../selectors/user';
import { RootState } from '../reducers';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  email: string;
  password: string;
  passwordValidation: string;
  validationError: string;
}

interface IProps extends NavigationInjectedProps {}

interface StateProps {
  authError: string;
  userError: string;
}

type Props = IProps & StateProps & DispatchProps;

class SignupFormContainerComponent extends React.PureComponent<Props, State> {
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
      await Keychain.setGenericPassword('token', token, keychainArguments);
      this.props.navigation.navigate('SignupSuccess');
    } catch (err) {
      Alert.alert('Oops!', 'We have successfully created your account, but could not log you in. Please try logging in manually.');
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { userError, authError } = this.props;

    if (authError && prevProps.authError !== authError) {
      return Alert.alert('Oops!', authError);
    }

    if (userError && prevProps.userError !== userError) {
      return Alert.alert('Oops!', userError);
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
      // Only stop loading on error, so we can keep a persisting activity indicator till we switch screens
      this.setState({ isLoading: false });
    }
  }

  handleOnPressSignup = async () => {
    const { email, password, passwordValidation } = this.state;

    if (password !== passwordValidation) {
      return Alert.alert('Oops!', 'The given passwords do not match. Please make sure you typed your passwords correctly.');
    }

    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.createUser(email, password);
        this.autoLogin();
      } catch (err) {
        // Only stop loading on error, so we can keep a persisting activity indicator till we switch screens
        this.setState({ isLoading: false });
      }
    });
  }

  handleOnChangeText = (field: 'email' | 'password' | 'passwordValidation', value: string) => {
    if (field === 'email') this.setState({ email: value });
    if (field === 'password') this.setState({ password: value });
    if (field === 'passwordValidation') this.setState({ passwordValidation: value });
  }

  render() {
    const { email, password, passwordValidation, isLoading } = this.state;

    return (
      <SignupForm
        email={email}
        password={password}
        passwordValidation={passwordValidation}
        isLoading={isLoading}
        onChangeText={this.handleOnChangeText}
        onPressSignup={this.handleOnPressSignup}
      />
    );
  }
}

interface StateProps {
  authError: ReturnType<typeof selectAuthError>;
  userError: ReturnType<typeof selectUserError>;
}

interface DispatchProps {
  createUser: typeof createUser;
  postAuth: typeof postAuth;
}

const mapStateToProps = (state: RootState): StateProps => ({
  authError: selectAuthError(state),
  userError: selectUserError(state)
});

const mapDispatchToProps = {
  createUser,
  postAuth
};

export const SignupFormContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignupFormContainerComponent)
);
