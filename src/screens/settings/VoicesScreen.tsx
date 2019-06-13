import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import { ScrollView } from 'react-native';
import { VoiceSelectContainer } from '../../containers/VoiceSelectContainer';
import { ButtonUpgradeContainer } from '../../containers/ButtonUpgradeContainer';

export class SettingsVoicesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Voices',
      headerRight: <ButtonUpgradeContainer />,
    };
  }

  render() {
    return (
      <ScrollView>
        <VoiceSelectContainer />
      </ScrollView>
    );
  }
}
