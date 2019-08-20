import React from 'react';

import { AppBackground } from '../components/AppBackground';
import { InteractionManaged } from '../components/InteractionManaged';
import { PlaylistContainer } from '../containers/PlaylistContainer';


export class ArchiveScreen extends React.PureComponent {
  render() {
    return (
      <AppBackground>
        <InteractionManaged showActivityIndicator>
          <PlaylistContainer isArchiveScreen />
        </InteractionManaged>
      </AppBackground>
    );
  }
}
