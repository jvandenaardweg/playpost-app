import React from 'react';

import { AppBackground } from '../components/AppBackground';
import { PlaylistContainer } from '../containers/PlaylistContainer';
import { InteractionManaged } from '../components/InteractionManaged';

export class FavoritesScreen extends React.PureComponent {
  render(): JSX.Element {
    return (
      <InteractionManaged>
        <AppBackground>
          <PlaylistContainer isFavoriteScreen />
        </AppBackground>
      </InteractionManaged>

    );
  }
}
