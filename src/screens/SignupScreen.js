import React from 'react';
import { View, Text, TextInput, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { createUser } from '@/reducers/users';
import { postAuth } from '@/reducers/auth';

class SignupScreenContainer extends React.Component {
  static navigationOptions = {
    title: 'Signup'
  };

  state = {
    email: null,
    password: null
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

  handleSignupPress = () => {
    const { email, password } = this.state;

    this.props.createUser(email, password);
  }

  signupButtonTitle = () => {
    const isLoading = this.props.users.isLoading || this.props.auth.isLoading;

    if (isLoading) return 'Loading...';

    return 'Signup';
  }

  render() {
    const { email, password } = this.state;
    const { user, error, isLoading } = this.props.users;
    const { token } = this.props.auth;

    return (
      <View>
        <View>
          <TextInput
            placeholder="E-mail address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => this.setState({ email: text })}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          />

          <TextInput
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={(text) => this.setState({ password: text })}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          />
          <Text>{error}</Text>
          <Button title={this.signupButtonTitle()} onPress={this.handleSignupPress} disabled={isLoading} />
          <Text>
            User:
            {user.id}
          </Text>
          <Text>
            Token:
            {token}
          </Text>
          <Button title="Login" onPress={() => this.props.navigation.navigate('Login')} />
        </View>
      </View>
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
