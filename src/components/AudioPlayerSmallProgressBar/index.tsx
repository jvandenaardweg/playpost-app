import React from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

import styles from './styles';

type State = TrackPlayer.ProgressComponentState;

export class AudioPlayerSmallProgressBar extends ProgressComponent<any, State> {
  shouldComponentUpdate(nextProps: any, nextState: State) {
    return !isEqual(this.state, nextState);
  }

  render() {
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
