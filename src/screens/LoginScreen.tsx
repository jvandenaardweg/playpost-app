import React from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions, NavigationInjectedProps } from 'react-navigation';
import { Alert, Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

import { LoginForm } from '../components/LoginForm';

import { getAuthToken } from '../reducers/auth';

import { selectAuthError, selectAuthenticationToken } from '../selectors/auth';
import { RootState } from '../reducers';
import { ButtonClose } from '../components/ButtonClose';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  email: string;
  password: string;
  error: any;
}

interface IProps extends NavigationInjectedProps {}

type Props = IProps & StateProps & DispatchProps;

class LoginScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Login',
      headerLeft: null,
      headerRight: <ButtonClose onPress={navigation.getParam('handleOnClose')} />
    };
  }

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
      return Alert.alert('Oops!', authError);
    }

    // If we have a token, the user is logged in successfully!
    // Navigate the user to the app
    if (token && prevProps.token !== token) {
      this.saveToken(token);
    }
  }

  saveToken = async (token: string) => {
    await Keychain.setGenericPassword('token', token, keychainArguments);
    this.props.navigation.navigate('App');
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
    if (field === 'email') this.setState({ email: value });
    if (field === 'password') this.setState({ password: value });
  }

  render() {
    const { email, password, isLoading } = this.state;

    return (
      <LoginForm
        email={email}
        password={password}
        isLoading={isLoading}
        onChangeText={this.handleOnChangeText}
        onPressLogin={this.handleOnPressLogin}
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

export const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
