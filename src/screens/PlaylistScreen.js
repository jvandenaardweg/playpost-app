import React from 'react';
import { PlaylistsContainer } from '@/containers/PlaylistsContainer';

import { AppBackground } from '@/components/AppBackground';

export class PlaylistScreen extends React.Component {
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
