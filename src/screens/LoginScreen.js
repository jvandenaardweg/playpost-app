import React from 'react';
import { View, Text, TextInput, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { postAuth } from '@/reducers/auth';

class LoginScreenContainer extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  state = {
    email: null,
    password: null
  }

  async componentDidUpdate() {
    const { token } = this.props.auth;

    if (token) {
      await AsyncStorage.setItem('userToken', token);
      this.props.navigation.navigate('App');
    }
  }

  handleLoginPress = () => {
    const { email, password } = this.state;

    this.props.postAuth(email, password);
  }

  loginButtonTitle = () => {
    const { isLoading } = this.props.auth;

    if (isLoading) return 'Loading...';

    return 'Login';
  }

  render() {
    const { email, password } = this.state;
    const { token, error, isLoading } = this.props.auth;

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
          <Button title={this.loginButtonTitle()} onPress={this.handleLoginPress} disabled={isLoading} />
          <Text>
            Token:
            {token}
          </Text>
          <Button title="Signup" onPress={() => this.props.navigation.navigate('Signup')} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = {
  postAuth
};

export const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
