import React from 'react';
import { View, Text, TextInput, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { postAuth } from '@/reducers/auth';
import { getMe } from '@/reducers/me';

import { LoginForm } from '@/components/LoginForm';

class LoginScreenContainer extends React.PureComponent {
  static navigationOptions = {
    title: 'Login',
    // header: null
  };

  state = {
    email: null,
    password: null
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

  handleOnChangeText = (field, value) => this.setState({ [field]: value });

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

const mapStateToProps = ({ auth, me }) => ({
  auth,
  me
});

const mapDispatchToProps = {
  postAuth,
  getMe
};

export const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
