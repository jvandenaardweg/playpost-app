import React from 'react';

import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { ButtonUpgradeContainer } from '../../containers/ButtonUpgradeContainer';
import { SettingsContainer } from '../../containers/SettingsContainer';

export const SettingsScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <AppBackground>
      <SettingsContainer />
    </AppBackground>
  );
})

SettingsScreen.navigationOptions = (): NavigationStackOptions => {
  return {
    title: 'Settings',
    headerRight: <ButtonUpgradeContainer />
  };
}
