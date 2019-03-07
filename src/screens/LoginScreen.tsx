import React from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { postAuth, AuthState } from '../reducers/auth';
import { getMe, MeState } from '../reducers/me';

import { LoginForm } from '../components/LoginForm';

interface State {
  email?: string,
  password?: string
}

interface Props {
  auth: any,
  me: any,
  getMe: (token: string) => {},
  postAuth: (email: string, password: string) => {},
  navigation: NavigationScreenProp<NavigationRoute>
}

class LoginScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = {
    title: 'Login'
  };

  state = {
    email: '',
    password: ''
  }

  async componentDidUpdate() {
    const { token } = this.props.auth;
    const { user } = this.props.me;

    if (this.props.auth.isLoading || this.props.me.isLoading) {
      return;
    }

    // If we have a token, but no user yet, get the account details
    if (token && !user.id) {
      await AsyncStorage.setItem('userToken', token);
      this.props.getMe(token);
    }

    // If we got a user, we can redirect it to our app screen
    if (user.id) {
      this.props.navigation.navigate('App');
    }
  }

  handleOnPressLogin = () => {
    const { email, password } = this.state;
    this.props.postAuth(email, password);
  }

  handleOnPressSignup = () => this.props.navigation.navigate('Signup');

  handleOnChangeText = (field: string, value: string) => this.setState({ [field]: value });

  render() {
    const { email, password } = this.state;
    const { error } = this.props.auth;

    // A way to keep showing loading untill we navigate
    // Or when an error happens
    let isLoading = this.props.auth.isLoading || this.props.me.isLoading;

    // TODO: loading goes away if the user has an error, so this might not be a good way


    if (error) {
      isLoading = false;
    }

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

const mapStateToProps = (state: { auth: AuthState, me: MeState }) => ({
  auth: state.auth,
  me: state.me
});

const mapDispatchToProps = {
  postAuth,
  getMe
};

export const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
