import React from 'react';
import { PlaylistsContainer } from '../containers/PlaylistsContainer';

import { AppBackground } from '../components/AppBackground';
import { OfflineNotice } from '../components/OfflineNotice/OfflineNotice';

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
