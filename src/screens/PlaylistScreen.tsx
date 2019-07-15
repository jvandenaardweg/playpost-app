import React from 'react';

import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { AppBackground } from '../components/AppBackground';
import { ButtonVoices } from '../components/ButtonVoices';
import { PlaylistContainer } from '../containers/PlaylistContainer';

export class PlaylistScreen extends React.PureComponent {
  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Playlist',
      headerLeft: <ButtonVoices onPress={() => navigation.navigate('ModalLanguages')} />
    };
  }

  public render() {
    return (
      <AppBackground>
        <PlaylistContainer />
      </AppBackground>
    );
  }
}
