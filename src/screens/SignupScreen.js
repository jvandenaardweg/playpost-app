import React from 'react';
import { View, Text, TextInput, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { createUser } from '@/reducers/users';
import { postAuth } from '@/reducers/auth';

import { SignupForm } from '@/components/SignupForm';

class SignupScreenContainer extends React.PureComponent {
  static navigationOptions = {
    title: 'Signup',
    header: null
  };

  state = {
    email: null,
    password: null,
    passwordValidation: null,
    validationError: null
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

  handleOnPressSignup = () => {
    const { email, password, passwordValidation } = this.state;

    if (password !== passwordValidation) {
      return this.setState({ validationError: 'The given passwords do not match. Please make sure you typed your passwords correctly.' });
    }

    return this.props.createUser(email, password);
  }

  handleOnPressLogin = () => this.props.navigation.navigate('Login');

  handleOnChangeText = (field, value) => this.setState({ [field]: value });

  render() {
    const { email, password, passwordValidation, validationError } = this.state;
    const { error, isLoading } = this.props.auth;

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

  // render() {
  //   const { email, password } = this.state;
  //   const { user, error, isLoading } = this.props.users;
  //   const { token } = this.props.auth;

  //   return (
  //     <View>
  //       <View>
  //         <TextInput
  //           placeholder="E-mail address"
  //           autoCapitalize="none"
  //           value={email}
  //           onChangeText={(text) => this.setState({ email: text })}
  //           style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
  //         />

  //         <TextInput
  //           placeholder="Password"
  //           autoCapitalize="none"
  //           secureTextEntry
  //           value={password}
  //           onChangeText={(text) => this.setState({ password: text })}
  //           style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
  //         />
  //         <Text>{error}</Text>
  //         <Button title={this.signupButtonTitle()} onPress={this.handleSignupPress} disabled={isLoading} />
  //         <Text>
  //           User:
  //           {user.id}
  //         </Text>
  //         <Text>
  //           Token:
  //           {token}
  //         </Text>
  //         <Button title="Login" onPress={() => this.props.navigation.navigate('Login')} />
  //       </View>
  //     </View>
  //   );
  // }
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
