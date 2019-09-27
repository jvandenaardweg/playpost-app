import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import colors from '../../constants/colors';
import { SignupFormContainer } from '../../containers/SignupFormContainer';


export class SignupScreen extends React.PureComponent {
  static navigationOptions = (): NavigationStackOptions => {
    return {
      title: 'Create new account'
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} animated />
        <SignupFormContainer />
      </SafeAreaView>
    );
  }
}
