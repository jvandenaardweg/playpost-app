import React from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp, SafeAreaView } from 'react-navigation';

import { InteractionManaged } from '../../components/InteractionManaged';
import { LargeAudioPlayerContainer } from '../../containers/LargeAudioPlayerContainer';

export const FullAudioPlayerScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <InteractionManaged>
        <LargeAudioPlayerContainer />
      </InteractionManaged>
    </SafeAreaView>
  );
})
