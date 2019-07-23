import React from 'react';
import { Alert, Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

import { LoginForm } from '../components/LoginForm';

import { getAuthToken } from '../reducers/auth';

import { ALERT_LOGIN_SAVE_TOKEN_FAIL } from '../constants/messages';
import { RootState } from '../reducers';
import { selectAuthenticationToken, selectAuthError } from '../selectors/auth';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  email: string;
  password: string;
  error: any;
}

type Props = NavigationInjectedProps & StateProps & DispatchProps;

class LoginFormContainerComponent extends React.PureComponent<Props, State> {
  public state = {
    isLoading: false,
    email: '',
    password: '',
    error: null
  };

  public componentDidMount() {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });
  }

  public componentDidUpdate(prevProps: Props) {
    const { authError, token } = this.props;

    if (authError && prevProps.authError !== authError) {
      this.setState({ isLoading: false });
      return Alert.alert('Oops!', authError);
    }

    // If we have a token, the user is logged in successfully!
    // Navigate the user to the app
    if (token && prevProps.token !== token) {
      this.saveToken(token);
    }
  }

  public saveToken = async (token: string) => {
    try {
      await Keychain.setGenericPassword('token', token, keychainArguments);
      this.props.navigation.navigate('App');
    } catch (err) {
      Alert.alert('Oops!', ALERT_LOGIN_SAVE_TOKEN_FAIL, [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Try again',
          onPress: () => this.saveToken(token)
        }
      ]);
    }
  }

  public handleOnClose = () => {
    this.props.navigation.goBack();
  }

  public handleOnPressLogin = async () => {
    const { email, password } = this.state;

    this.setState({ isLoading: true }, () => {
      this.props.getAuthToken(email, password);
    });
  }

  public handleOnChangeText = (field: 'email' | 'password', value: string) => {
    if (field === 'email') { this.setState({ email: value }); }
    if (field === 'password') { this.setState({ password: value }); }
  }

  public handleOnPressForgotPassword = () => this.props.navigation.navigate('login/forgot-password');

  public render(): JSX.Element {
    const { email, password, isLoading } = this.state;

    return (
      <LoginForm
        email={email}
        password={password}
        isLoading={isLoading}
        onChangeText={this.handleOnChangeText}
        onPressLogin={this.handleOnPressLogin}
        onPressForgotPassword={this.handleOnPressForgotPassword}
      />
    );
  }
}

interface StateProps {
  authError: ReturnType<typeof selectAuthError>;
  token: ReturnType<typeof selectAuthenticationToken>;
}

interface DispatchProps {
  getAuthToken: typeof getAuthToken;
}

const mapStateToProps = (state: RootState) => ({
  authError: selectAuthError(state),
  token: selectAuthenticationToken(state)
});

const mapDispatchToProps = {
  getAuthToken
};

export const LoginFormContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginFormContainerComponent)
);
