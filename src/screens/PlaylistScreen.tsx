import * as React from 'React';
import { PlaylistsContainer } from '../containers/PlaylistsContainer';

import { AppBackground } from '../components/AppBackground';

export class PlaylistScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Playlist',
  };

  render() {
    return (
      <AppBackground>
        <PlaylistsContainer />
      </AppBackground>
    );
  }
}
