import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { VoiceSelectContainer } from '../../containers/VoiceSelectContainer';

export class SettingsVoicesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Voices'
    };
  }

  render() {
    return (
      <AppBackground>
        <InteractionManaged>
          <VoiceSelectContainer />
        </InteractionManaged>
      </AppBackground>
    );
  }
}
