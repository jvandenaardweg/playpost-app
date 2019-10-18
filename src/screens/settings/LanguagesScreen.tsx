import React from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { LanguagesSelectContainer } from '../../containers/LanguageSelectContainer';

export const SettingsLanguagesScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <AppBackground>
      <InteractionManaged>
        <LanguagesSelectContainer />
      </InteractionManaged>
    </AppBackground>
  );
})

SettingsLanguagesScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
  return {
    title: 'Languages'
  };
}
