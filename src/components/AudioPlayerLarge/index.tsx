import React, { useEffect, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

import { ArticleReader } from '../ArticleReader';
import { AudioPlayerProgressBar } from '../AudioPlayerProgressBar';
import * as Icon from '../Icon';
import { PlayPauseControlCircle } from '../PlayPauseControl';

import { defaultHitslop } from '../../constants/buttons';
import colors from '../../constants/colors';

import { PlaybackSpeedSlider } from '../PlaybackSpeedSlider';
import styles from './styles';

export interface Props {
  isPlaying: boolean;
  isLoading: boolean;
  isPlaybackSpeedVisible: boolean;
  article?: Api.Article;
  playbackSpeed: number;
  onPressPlay(): void;
  onProgressChange(value: number): void;
  onSetPlaybackSpeed(speed: number): void;
  onTogglePlaybackSpeedVisibility(): void;
  onPressJumpForward(): void;
  onPressJumpBackward(): void;
}

export const AudioPlayerLarge: React.FC<Props> = React.memo((props: Props) => {
  const [animatedBottomValue] = useState(new Animated.Value(150));

  useEffect(() => {
    if (props.isPlaybackSpeedVisible) {
      Animated.spring(                  // Animate over time
        animatedBottomValue,            // The animated value to drive
        {
          toValue: 0,
          useNativeDriver: true,
          velocity: 4,
          speed: 8
        }
      ).start();
    } else {
      Animated.spring(
        animatedBottomValue,
        {
          toValue: 150,
          useNativeDriver: true,
          velocity: 4,
          speed: 8
        }
      ).start();
    }

  }, [props.isPlaybackSpeedVisible])

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.scrollableContainer}>
          {props.article && <ArticleReader article={props.article} theme="dark" />}
        </View>
        <View style={styles.controlsContainer}>
          <AudioPlayerProgressBar onProgressChange={props.onProgressChange} />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              testID="AudioPlayerLarge-TouchableOpacity-playbackspeed"
              style={styles.buttonControl}
              hitSlop={defaultHitslop}
              onPress={props.onTogglePlaybackSpeedVisibility}
            >
              {props.isPlaybackSpeedVisible && (<Icon.FontAwesome name="times" color="white" size={22} />)}
                {!props.isPlaybackSpeedVisible && (
                  <Text
                    testID="AudioPlayerLarge-Text-playbackspeed"
                    style={styles.buttonControlText}
                  >
                    {props.playbackSpeed.toFixed(2)}x</Text>
                )}
            </TouchableOpacity>
          </View>
          <View style={styles.controlsRow}>
            <View style={styles.controlContainer}>
              <TouchableOpacity
                testID="AudioPlayerLarge-TouchableOpacity-jump-backward"
                hitSlop={defaultHitslop}
                onPress={props.onPressJumpBackward}
              >
                <Icon.MaterialIcons name="replay-10" color="white" size={42} />
              </TouchableOpacity>
            </View>
            <View style={{ opacity: (props.isPlaybackSpeedVisible) ? 0 : 1, height: 64 }}>
              <PlayPauseControlCircle
                size={24}
                iconColor={colors.black}
                isLoading={props.isLoading}
                isPlaying={props.isPlaying}
                isDisabled={props.isPlaybackSpeedVisible}
                onPressPlay={props.onPressPlay}
              />
            </View>
            <View>
              <View style={styles.controlContainer}>
                <TouchableOpacity
                  testID="AudioPlayerLarge-TouchableOpacity-jump-forward"
                  hitSlop={defaultHitslop}
                  onPress={props.onPressJumpForward}
                >
                  <Icon.MaterialIcons name="forward-10" color="white" size={42} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>
        <View style={styles.footer}>
          <Animated.View style={[styles.footerAnimatedView, { transform: [{translateY: animatedBottomValue}] }]}>
            <PlaybackSpeedSlider onSetPlaybackSpeed={props.onSetPlaybackSpeed} playbackSpeed={props.playbackSpeed} />
          </Animated.View>
        </View>
      </View>
    </View>
  )
});
