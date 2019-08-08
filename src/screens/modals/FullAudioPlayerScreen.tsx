import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { InteractionManaged } from '../../components/InteractionManaged';
import { AudioPlayerContainer } from '../../containers/AudioPlayerContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class FullAudioPlayerScreen extends React.PureComponent<Props> {
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <InteractionManaged>
          <AudioPlayerContainer isLarge />
        </InteractionManaged>
      </SafeAreaView>
    );
  }
}
