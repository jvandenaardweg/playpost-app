import React from 'react';
import { PlaylistsContainer } from '@/containers/PlaylistsContainer';

export default class PlaylistScreen extends React.Component {
  static navigationOptions = {
    title: 'Playlist',
  };

  render() {
    return (
      <PlaylistsContainer />
    );
  }
}
