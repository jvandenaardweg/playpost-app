import React from 'react';

import { AppBackground } from '../components/AppBackground';
import { InteractionManaged } from '../components/InteractionManaged';
import { PlaylistContainer } from '../containers/PlaylistContainer';

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
