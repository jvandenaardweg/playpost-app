import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import * as Icon from '../Icon';

import { defaultHitslop } from '../../constants/buttons';
import colors from '../../constants/colors';
import styles from './styles';

interface IProps {
  size?: number;
  iconColor?: string;
  onPressPlay(): void;
}

interface PlayPauseIconProps {
  isPlaying: boolean;
  isLoading: boolean;
  size?: number;
  color?: string;
}

type Props = PlayPauseIconProps & IProps;

export const PlayPauseControl: React.FC<Props> = React.memo(({ isPlaying, isLoading, size, onPressPlay }) => {
  return (
    <TouchableOpacity testID="PlayPauseControl-button" disabled={isLoading} style={styles.playButton} activeOpacity={1} onPress={() => onPressPlay()} hitSlop={defaultHitslop}>
      <View style={styles.controlPlay}>
        <PlayPauseIcon isLoading={isLoading} isPlaying={isPlaying} size={size} />
      </View>
    </TouchableOpacity>
  );
});

export const PlayPauseControlCircle: React.FC<Props> = React.memo(({ isPlaying, isLoading, size, iconColor, onPressPlay }) => {
  return (
    <TouchableOpacity
      testID="PlayPauseControlCircle-button"
      style={[styles.playButton, styles.playButtonCircle]}
      activeOpacity={1}
      onPress={() => onPressPlay()}
      hitSlop={defaultHitslop}
      disabled={isLoading}
    >
      <View style={styles.controlPlay}>
        <PlayPauseIcon isLoading={isLoading} isPlaying={isPlaying} size={size} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
});

export const PlayPauseIcon: React.FC<PlayPauseIconProps> = React.memo(({ isPlaying, isLoading, size, color }) => {
  if (isLoading) { return <ActivityIndicator color="white" />; }
  if (isPlaying) { return <Icon.FontAwesome5 name="pause" color={color ? color : colors.white} size={size ? size : 16} />; }
  return <Icon.FontAwesome5 name="play" color={color ? color : colors.white} size={size ? size : 16} style={{ marginLeft: 3 }} />;
});
