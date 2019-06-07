import React from 'react';
import { View, Text } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { Slider } from 'react-native-elements';
import isEqual from 'react-fast-compare';

import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  color?: string;
  backgroundColor?: string;
  onProgressChange?(percentage: number): void;
}

type State = TrackPlayer.ProgressComponentState;

export class AudioPlayerProgressBar extends ProgressComponent<Props, State> {

  static defaultProps = {
    color: colors.tintColor,
    backgroundColor: colors.white
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  get shouldShowInteractiveSlider () {
    return Boolean(this.props.onProgressChange);
  }

  displayTime (inputSeconds: number) {
    // const hours = seconds / 3600;
    const minutes = (inputSeconds % 3600) / 60;
    const seconds = inputSeconds % 60;

    return [minutes, seconds].map(this.formatTime).join(':');
  }

  formatTime (val: number) {
    return (`0${Math.floor(val)}`).slice(-2);
  }

  render() {
    let percentage = 0;
    const { position, duration } = this.state;

    if (position && duration) {
      percentage = position / duration;
    }

    const remaining = duration - position;
    const readablePosition = this.displayTime(position);
    const readableRemaining = (remaining > 0) ? `-${this.displayTime((duration - position))}` : '00:00';

    if (this.shouldShowInteractiveSlider) {
      return (
        <View style={styles.containerInteractive}>
          <View style={styles.sliderContainer}>
            <Slider
              minimumValue={0}
              maximumValue={1}
              value={percentage}
              minimumTrackTintColor={colors.white}
              maximumTrackTintColor={colors.grayDarkest}
              thumbTintColor={colors.white}
              thumbStyle={styles.thumbStyle}
              trackStyle={styles.trackStyle}
              onSlidingComplete={this.props.onProgressChange}
            />
          </View>
          <View style={styles.progressTimeContainer}>
            <View><Text style={styles.timeText}>{readablePosition}</Text></View>
            <View><Text style={styles.timeText}>{readableRemaining}</Text></View>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container, { backgroundColor: this.props.backgroundColor }]}>
        <View style={[styles.progress, { width: `${percentage * 100}%`, backgroundColor: this.props.color }]} />
      </View>
    );
  }
}
