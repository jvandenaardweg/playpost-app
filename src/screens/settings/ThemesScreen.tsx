import React from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { ThemeSelectContainer } from '../../containers/ThemeSelectContainer';

export const SettingsThemesScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <AppBackground>
      <InteractionManaged>
        <ThemeSelectContainer />
      </InteractionManaged>
    </AppBackground>
  );
})

SettingsThemesScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
  return {
    title: 'Theme'
  };
}
