import React from 'react';
import { View, Text } from 'react-native';

export default class OnboardingScreen extends React.Component {
  static navigationOptions = {
    title: 'Onboarding'
  };

  render() {
    return (
      <View>
        <Text>Onboarding</Text>
      </View>
    );
  }
}
