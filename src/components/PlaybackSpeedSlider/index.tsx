import React, { useEffect, useState } from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Slider } from 'react-native-elements';

import { mediumHitslop } from '../../constants/buttons';
import colors from '../../constants/colors';

import * as Icon from '../Icon';

import styles from './styles';

interface Props {
  playbackSpeed: number;
  onSetPlaybackSpeed(speed: number): void;
}

export const PlaybackSpeedSlider: React.FC<Props> = React.memo(({ onSetPlaybackSpeed, playbackSpeed }) => {
  const [localPlaybackSpeed, setLocalPlaybackSpeed] = useState(playbackSpeed);

  useEffect(() => {
    setLocalPlaybackSpeed(playbackSpeed);
  }, [playbackSpeed])

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <TouchableOpacity
          onPress={() => onSetPlaybackSpeed(1)}
          testID="PlaybackSpeedSlider-TouchableOpacity-label"
        >
          <Text
            style={styles.labelText}
            testID="PlaybackSpeedSlider-Text-label"
          >
            {localPlaybackSpeed.toFixed(2)}x
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableHighlight
          testID="PlaybackSpeedSlider-TouchableHighlight-minus"
          hitSlop={mediumHitslop}
          onPress={() => onSetPlaybackSpeed(localPlaybackSpeed - 0.01)}
          style={styles.controlButton}
        >
          <Icon.FontAwesome5 name="minus" size={14} color={colors.white} />
        </TouchableHighlight>
        <View style={styles.sliderContainer}>
          <Slider
            maximumValue={2}
            minimumValue={0.1}
            step={0.01}
            value={playbackSpeed}
            onValueChange={value => setLocalPlaybackSpeed(value)}
            onSlidingComplete={value => onSetPlaybackSpeed(value)}
            minimumTrackTintColor={colors.tintColorDark}
            maximumTrackTintColor={colors.tintColorDark}
            thumbStyle={styles.sliderThumbStyle}
            trackStyle={styles.sliderTrackStyle}
          />
        </View>
        <TouchableHighlight
          testID="PlaybackSpeedSlider-TouchableHighlight-plus"
          hitSlop={mediumHitslop}
          onPress={() => onSetPlaybackSpeed(localPlaybackSpeed + 0.01)}
          style={styles.controlButton}
        >
          <Icon.FontAwesome5 name="plus" size={14} color={colors.white} />
        </TouchableHighlight>
      </View>
    </View>
  );
});
