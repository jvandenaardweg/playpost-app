import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
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
      <InteractionManaged>
        <VoiceSelectContainer />
      </InteractionManaged>
    );
  }
}
