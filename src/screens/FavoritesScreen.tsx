import React from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../components/AppBackground';
import { ButtonVoices } from '../components/ButtonVoices';
import { InteractionManaged } from '../components/InteractionManaged';
import { ButtonUpgradeContainer } from '../containers/ButtonUpgradeContainer';
import { PlaylistContainer } from '../containers/PlaylistContainer';

export const FavoritesScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <AppBackground>
      <InteractionManaged>
        <PlaylistContainer isFavoriteScreen />
      </InteractionManaged>
    </AppBackground>
  );
})

FavoritesScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
  return {
    title: 'Favorites',
    headerLeft: () => <ButtonVoices onPress={() => navigation.navigate('ModalLanguages')} />,
    headerRight: () => <ButtonUpgradeContainer />
  };
}
