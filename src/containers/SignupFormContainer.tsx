import React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

import { SignupForm } from '../components/SignupForm';

import { postAuth } from '../reducers/auth';
import { createUser } from '../reducers/user';

import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../constants/urls';
import { RootState } from '../reducers';
import { selectAuthError } from '../selectors/auth';
import { selectUserError } from '../selectors/user';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  email: string;
  password: string;
  validationError: string;
}

interface StateProps {
  authError: string;
  userError: string;
}

type Props = NavigationInjectedProps & StateProps & DispatchProps;

class SignupFormContainerComponent extends React.PureComponent<Props, State> {
  public state = {
    isLoading: false,
    email: '',
    password: '',
    validationError: ''
  };

  /**
   * Saves the token in our secure storage and redirects to user to the success page
   */
  public saveToken = async (token: string) => {
    try {
      await Keychain.setGenericPassword('token', token, keychainArguments);
      this.props.navigation.navigate('SignupSuccess');
    } catch (err) {
      Alert.alert('Oops!', 'We have successfully created your account, but could not log you in. Please try logging in manually.');
      this.setState({ isLoading: false });
    }
  }

  public componentDidUpdate(prevProps: Props) {
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
  public autoLogin = async () => {
    const { email, password } = this.state;

    try {
      const response: any = await this.props.postAuth(email, password);
      this.saveToken(response.payload.data.token);
    } catch (err) {
      // Only stop loading on error, so we can keep a persisting activity indicator till we switch screens
      this.setState({ isLoading: false });
    }
  }

  public handleOnPressSignup = async () => {
    const { email, password } = this.state;

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

  public handleOnPressPrivacyPolicy = () => Linking.openURL(`${URL_PRIVACY_POLICY}?ref=playpost://signup`);

  public handleOnPressTerms = () => Linking.openURL(`${URL_TERMS_OF_USE}?ref=playpost://signup`);

  public handleOnChangeText = (field: 'email' | 'password', value: string) => {
    if (field === 'email') { this.setState({ email: value }); }
    if (field === 'password') { this.setState({ password: value }); }
  }

  public render(): JSX.Element {
    const { email, password, isLoading } = this.state;

    return (
      <SignupForm
        email={email}
        password={password}
        isLoading={isLoading}
        onChangeText={this.handleOnChangeText}
        onPressSignup={this.handleOnPressSignup}
        onPressPrivacyPolicy={this.handleOnPressPrivacyPolicy}
        onPressTerms={this.handleOnPressTerms}
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
