import * as React from 'React';

import { OnboardingSlider } from '../components/OnboardingSlider';

export class OnboardingScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Introduction',
    header: null
  };

  render() {
    return (
      <OnboardingSlider />
    );
  }
}
