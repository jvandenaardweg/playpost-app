import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { AppBackground } from '../../components/AppBackground';
import { VoiceSelectContainer } from '../../containers/VoiceSelectContainer';

export class SettingsVoicesScreen extends React.PureComponent {
  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Voices'
    };
  }

  public render() {
    return (
      <AppBackground>
        <VoiceSelectContainer />
      </AppBackground>
    );
  }
}
