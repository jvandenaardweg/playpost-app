import React from 'react';

import { PlaylistContainer } from '../containers/PlaylistContainer';
import { AppBackground } from '../components/AppBackground';

export class FavoritesScreen extends React.PureComponent {
  render() {
    return (
      <AppBackground>
        <PlaylistContainer isFavoriteScreen />
      </AppBackground>
    );
  }
}
