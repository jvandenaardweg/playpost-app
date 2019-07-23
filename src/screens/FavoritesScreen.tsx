import React from 'react';

import { AppBackground } from '../components/AppBackground';
import { PlaylistContainer } from '../containers/PlaylistContainer';

export class FavoritesScreen extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <AppBackground>
        <PlaylistContainer isFavoriteScreen />
      </AppBackground>
    );
  }
}
