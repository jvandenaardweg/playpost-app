import React from 'react';

import { AppBackground } from '../components/AppBackground';
import { PlaylistContainer } from '../containers/PlaylistContainer';

export class PlaylistScreen extends React.PureComponent {
  public render() {
    return (
      <AppBackground>
        <PlaylistContainer />
      </AppBackground>
    );
  }
}
