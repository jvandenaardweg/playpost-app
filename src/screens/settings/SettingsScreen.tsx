import React from 'react';

import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { ButtonUpgradeContainer } from '../../containers/ButtonUpgradeContainer';
import { SettingsContainer } from '../../containers/SettingsContainer';

export class SettingsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
    return {
      // title: 'Settings',
      headerRight: <ButtonUpgradeContainer />
    };
  }

  render() {
    return (
      <AppBackground>
        <SettingsContainer />
      </AppBackground>
    );
  }
}
