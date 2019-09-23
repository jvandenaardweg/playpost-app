import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationStackScreenOptions } from 'react-navigation';

import { OnboardingSlider } from '../../components/OnboardingSlider';
import colors from '../../constants/colors';

export class OnboardingScreen extends React.PureComponent {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Introduction',
      header: null
    };
  }

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={colors.tintColor} animated />
        <OnboardingSlider />
      </>

    );
  }
}
