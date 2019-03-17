import React from 'react';
import { View } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { Slider } from 'react-native-elements';
import isEqual from 'react-fast-compare';

import colors from '../../../constants/colors';

import styles from './styles';

interface Props {
  onProgressChange?(percentage: number): void;
}

type State = TrackPlayer.ProgressComponentState;

export class ProgressBar extends ProgressComponent<Props, State> {

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  get shouldShowInteractiveSlider () {
    return Boolean(this.props.onProgressChange);
  }

  render() {
    let percentage = 0;
    const { position, duration } = this.state;

    if (position && duration) {
      percentage = position / duration;
    }

    if (this.shouldShowInteractiveSlider) {
      return (
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={percentage}
          minimumTrackTintColor={colors.tintColor}
          maximumTrackTintColor={colors.grayDark}
          thumbTintColor={colors.white}
          thumbStyle={{ width: 16, height: 16 }}
          trackStyle={{ height: 3, borderRadius: 3 }}
          onSlidingComplete={this.props.onProgressChange}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={[styles.progress, { width: `${percentage * 100}%` }]} />
      </View>
    );
  }
}