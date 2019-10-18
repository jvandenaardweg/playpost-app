import React from 'react';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { VoiceSelectContainer } from '../../containers/VoiceSelectContainer';

export class SettingsVoicesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
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
