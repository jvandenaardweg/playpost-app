import React from 'react';
import { PlaylistsContainer } from '../components/Playlists';

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
