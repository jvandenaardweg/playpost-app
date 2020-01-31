import React from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { VoiceSelectContainer } from '../../containers/VoiceSelectContainer';

export const SettingsVoicesScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <AppBackground>
      <InteractionManaged>
        <VoiceSelectContainer />
      </InteractionManaged>
    </AppBackground>
  );
});

SettingsVoicesScreen.navigationOptions = (): NavigationStackOptions => {
  return {
    title: 'Voices'
  };
}
