import React from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import * as Keychain from 'react-native-keychain';
import { Alert } from 'react-native';

import { LoginForm } from '../components/LoginForm';

import { postAuth } from '../reducers/auth';
import { getUser } from '../reducers/user';

import { getAuthError } from '../selectors/auth';
import { getUserError } from '../selectors/user';
import { RootState } from '../reducers';
import { ButtonClose } from '../components/Header/ButtonClose';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  email: string;
  password: string;
  error: any;
}

interface Props {
  authError: string;
  userError: string;
  getUser(): void;
  postAuth(email: string, password: string): void;
  navigation: NavigationScreenProp<NavigationRoute>;
}

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
    const { userError, authError } = this.props;

    if (authError && prevProps.authError !== authError) {
      return Alert.alert('Oops!', authError);
    }

    if (userError && prevProps.userError !== userError) {
      return Alert.alert('Oops!', userError);
    }
  }

  handleOnClose = () => {
    this.props.navigation.goBack();
  }

  saveToken = async (token: string) => {
    try {
      await Keychain.setGenericPassword('token', token, { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' });
      this.props.navigation.navigate('App');
    } catch (err) {
      this.setState({ isLoading: false, error: err  });
    }
  }

  handleOnPressLogin = async () => {
    const { email, password } = this.state;

    this.setState({ isLoading: true }, async () => {
      try {
        const response: any = await this.props.postAuth(email, password);
        this.saveToken(response.payload.data.token);
      } catch (err) {
        this.setState({ isLoading: false, error: err });
      }
    });
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
