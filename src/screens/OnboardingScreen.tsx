import React from 'react';
import { NavigationStackScreenOptions } from 'react-navigation';

import { OnboardingSlider } from '../components/OnboardingSlider';

export class OnboardingScreen extends React.PureComponent {
  static navigationOptions = (): NavigationStackScreenOptions => {
    return {
      title: 'Introduction',
      header: null
    };
  }

  render() {
    return (
      <OnboardingSlider />
    );
  }
}
