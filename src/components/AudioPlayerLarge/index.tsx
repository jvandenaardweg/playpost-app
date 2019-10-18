import React, { useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Animated, TouchableOpacity, View } from 'react-native';

import { ArticleReader } from '../ArticleReader';
import { AudioPlayerProgressBar } from '../AudioPlayerProgressBar';
import * as Icon from '../Icon';
import { PlayPauseControlCircle } from '../PlayPauseControl';
import Text from '../Text';

import { defaultHitslop, smallHitslop } from '../../constants/buttons';
import colors from '../../constants/colors';

import { UserTheme } from '../../reducers/user';
import { PlaybackSpeedSlider } from '../PlaybackSpeedSlider';
import styles from './styles';

export interface Props {
  isPlaying: boolean;
  isLoading: boolean;
  isPlaybackSpeedVisible: boolean;
  article?: Api.Article;
  audiofile?: Api.Audiofile;
  playbackSpeed: number;
  onPressPlay(): void;
  onProgressChange(value: number): void;
  onSetPlaybackSpeed(speed: number): void;
  onTogglePlaybackSpeedVisibility(): void;
  onPressJumpForward(): void;
  onPressJumpBackward(): void;
  onPressVoice(): void;
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
          {props.article && <ArticleReader article={props.article} forceTheme={UserTheme.dark} />}
        </View>
        <View style={styles.bottomContainer}>
          <AudioPlayerProgressBar onProgressChange={props.onProgressChange} />
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              testID="AudioPlayerLarge-TouchableOpacity-playbackspeed"
              style={{...styles.buttonControl, width: 65 }}
              hitSlop={smallHitslop}
              onPress={props.onTogglePlaybackSpeedVisibility}
            >
              {props.isPlaybackSpeedVisible && (<Icon.FontAwesome name="times" color="white" size={18} />)}
                {!props.isPlaybackSpeedVisible && (
                  <Text
                    testID="AudioPlayerLarge-Text-playbackspeed"
                    style={styles.buttonControlText}
                    preset="footnoteEmphasized"
                  >
                    {props.playbackSpeed.toFixed(2)}x
                  </Text>
                )}
            </TouchableOpacity>
            {props.audiofile && (
              <TouchableOpacity
                testID="AudioPlayerLarge-TouchableOpacity-voice"
                style={styles.buttonControl}
                hitSlop={smallHitslop}
                onPress={props.onPressVoice}
              >
                <Text style={styles.buttonControlText} preset="footnoteEmphasized">{props.audiofile.voice.label} ({props.audiofile.voice.languageCode})</Text>
              </TouchableOpacity>
            )}
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
}, isEqual);
