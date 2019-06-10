import React from 'react';

import { PlaylistContainer } from '../containers/PlaylistContainer';
import { AppBackground } from '../components/AppBackground';

export class ArchiveScreen extends React.PureComponent {
  render() {
    return (
      <AppBackground>
        <PlaylistContainer isArchiveScreen />
      </AppBackground>
    );
  }
}
