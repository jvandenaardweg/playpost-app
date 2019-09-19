import React from 'react';

import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { AppBackground } from '../../components/AppBackground';
import { ButtonUpgradeContainer } from '../../containers/ButtonUpgradeContainer';
import { SettingsContainer } from '../../containers/SettingsContainer';

export class SettingsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
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
