import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationStackScreenOptions } from 'react-navigation';

import colors from '../../constants/colors';
import { LoginFormContainer } from '../../containers/LoginFormContainer';

export class LoginScreen extends React.PureComponent {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Login',
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} animated />
        <LoginFormContainer />
      </SafeAreaView>
    );
  }
}
