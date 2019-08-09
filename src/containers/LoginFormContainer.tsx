import React from 'react';
import { Alert } from 'react-native';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import { LoginForm } from '../components/LoginForm';

import { getAuthToken } from '../reducers/auth';

import { ALERT_LOGIN_SAVE_TOKEN_FAIL, ALERT_TITLE_ERROR } from '../constants/messages';
import { RootState } from '../reducers';
import { selectAuthenticationToken, selectAuthError } from '../selectors/auth';
import * as keychain from '../utils/keychain';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  email: string;
  password: string;
  error: any;
}

type Props = NavigationInjectedProps & StateProps & DispatchProps;

class LoginFormContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    email: '',
    password: '',
    error: null
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });
  }

  componentDidUpdate(prevProps: Props) {
    const { authError, token } = this.props;

    if (authError && prevProps.authError !== authError) {
      this.setState({ isLoading: false });
      return Alert.alert(ALERT_TITLE_ERROR, authError);
    }

    // If we have a token, the user is logged in successfully!
    // Navigate the user to the app
    if (token && prevProps.token !== token) {
      this.saveToken(token);
    }
  }

  saveToken = async (token: string) => {
    try {
      await keychain.setToken(token);
      this.props.navigation.navigate('App');
    } catch (err) {
      Alert.alert(ALERT_TITLE_ERROR, ALERT_LOGIN_SAVE_TOKEN_FAIL, [
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

  handleOnClose = () => {
    this.props.navigation.goBack();
  }

  handleOnPressLogin = async () => {
    const { email, password } = this.state;

    this.setState({ isLoading: true }, () => {
      this.props.getAuthToken(email, password);
    });
  }

  handleOnChangeText = (field: 'email' | 'password', value: string) => {
    if (field === 'email') { this.setState({ email: value }); }
    if (field === 'password') { this.setState({ password: value }); }
  }

  handleOnPressForgotPassword = () => this.props.navigation.navigate('login/forgot-password');

  render() {
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
