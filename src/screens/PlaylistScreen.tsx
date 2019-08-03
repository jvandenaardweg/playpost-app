import React from 'react';

import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { AppBackground } from '../components/AppBackground';
import { ButtonVoices } from '../components/ButtonVoices';
import { InteractionManaged } from '../components/InteractionManaged';
import { ButtonUpgradeContainer } from '../containers/ButtonUpgradeContainer';
import { PlaylistContainer } from '../containers/PlaylistContainer';

export class PlaylistScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Playlist',
      headerLeft: <ButtonVoices onPress={() => navigation.navigate('ModalLanguages')} />,
      headerRight: <ButtonUpgradeContainer />
    };
  }

  render() {
    return (
      <AppBackground>
        <InteractionManaged showActivityIndicator>
          <PlaylistContainer />
        </InteractionManaged>
      </AppBackground>
    );
  }
}
