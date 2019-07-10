import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import { VoiceSelectContainer } from '../../containers/VoiceSelectContainer';
import { ButtonUpgradeContainer } from '../../containers/ButtonUpgradeContainer';
import { AppBackground } from '../../components/AppBackground';

export class SettingsVoicesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Voices',
      headerRight: <ButtonUpgradeContainer />
    };
  }

  render() {
    return (
      <AppBackground>
        <VoiceSelectContainer />
      </AppBackground>
    );
  }
}
