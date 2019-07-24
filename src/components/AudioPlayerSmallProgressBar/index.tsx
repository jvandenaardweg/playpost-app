import React from 'react';
import { View } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

import styles from './styles';

type State = TrackPlayer.ProgressComponentState;

export class AudioPlayerSmallProgressBar extends ProgressComponent<any, State> {
  render(): JSX.Element {
    let percentage = 0;
    const { position, duration } = this.state;

    if (position && duration) {
      percentage = position / duration;
    }

    return (
      <View style={styles.container}>
        <View style={[styles.progress, { width: `${percentage * 100}%` }]} />
      </View>
    );
  }
}
