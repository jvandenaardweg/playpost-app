import React from 'react';
import { Text, View } from 'react-native';
import { Slider } from 'react-native-elements';
import { useProgress } from 'react-native-track-player';

import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  color?: string;
  backgroundColor?: string;
  onProgressChange?(percentage: number): void;
}

export const AudioPlayerProgressBar: React.FC<Props> = React.memo(({ onProgressChange }) => {

  const progress = useProgress();

  let percentage = 0;
  const { position, duration } = progress;

  if (position && duration) {
    percentage = position / duration;
  }

  function displayTime (inputSeconds: number): string {
    // const hours = seconds / 3600;
    const minutes = (inputSeconds % 3600) / 60;
    const seconds = inputSeconds % 60;

    return [minutes, seconds].map(formatTime).join(':');
  }

  function formatTime (val: number): string {
    return (`0${Math.floor(val)}`).slice(-2);
  }

  const remaining = duration - position;
  const readablePosition = displayTime(position);
  const readableRemaining = (remaining > 0) ? `-${displayTime((duration - position))}` : '00:00';

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Slider
          minimumValue={0}
          maximumValue={1}
          step={0.001}
          value={percentage}
          minimumTrackTintColor={colors.white}
          maximumTrackTintColor={colors.grayDarker}
          thumbTintColor={colors.white}
          thumbStyle={styles.thumbStyle}
          trackStyle={styles.trackStyle}
          onSlidingComplete={onProgressChange}
        />
      </View>
      <View style={styles.progressTimeContainer}>
        <View><Text style={styles.timeText}>{readablePosition}</Text></View>
        <View><Text style={styles.timeText}>{readableRemaining}</Text></View>
      </View>
    </View>
  )
});
