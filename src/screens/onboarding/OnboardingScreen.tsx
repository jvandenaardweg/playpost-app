import React from 'react';
import { NavigationStackOptions } from 'react-navigation-stack';

import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { OnboardingSlider } from '../../components/OnboardingSlider';

export const OnboardingScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <OnboardingSlider />
  )
})

OnboardingScreen.navigationOptions = (): NavigationStackOptions => {
  return {
    title: 'Introduction',
    header: null
  };
}
