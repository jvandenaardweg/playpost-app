import React, { useEffect, useState } from 'react';
import { TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Slider } from 'react-native-elements';

import { mediumHitslop } from '../../constants/buttons';
import colors from '../../constants/colors';
import { Text } from '../Text';

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
          onPress={() => {
            const newSpeed = 1;
            setLocalPlaybackSpeed(newSpeed) // instant, just visual
            onSetPlaybackSpeed(newSpeed)
          }}
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
          onPress={() => {
            const newSpeed = localPlaybackSpeed - 0.01;
            setLocalPlaybackSpeed(newSpeed) // instant, just visual
            onSetPlaybackSpeed(newSpeed) // debounced
          }}
          style={styles.controlButton}
        >
          <Icon.FontAwesome5 name="minus" size={14} color={colors.white} />
        </TouchableHighlight>
        <View style={styles.sliderContainer}>
          <Slider
            maximumValue={2}
            minimumValue={0.1}
            step={0.01}
            value={localPlaybackSpeed}
            onValueChange={value => setLocalPlaybackSpeed(value)} // instant, just visual
            onSlidingComplete={value => onSetPlaybackSpeed(value)} // debounced
            minimumTrackTintColor={colors.tintColorDark}
            maximumTrackTintColor={colors.tintColorDark}
            thumbStyle={styles.sliderThumbStyle}
            trackStyle={styles.sliderTrackStyle}
          />
        </View>
        <TouchableHighlight
          testID="PlaybackSpeedSlider-TouchableHighlight-plus"
          hitSlop={mediumHitslop}
          onPress={() => {
            const newSpeed = localPlaybackSpeed + 0.01;
            setLocalPlaybackSpeed(newSpeed) // instant, just visual
            onSetPlaybackSpeed(newSpeed) // debounced
          }}
          style={styles.controlButton}
        >
          <Icon.FontAwesome5 name="plus" size={14} color={colors.white} />
        </TouchableHighlight>
      </View>
    </View>
  );
});
