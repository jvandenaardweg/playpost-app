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
  isDisabled?: boolean;
  size?: number;
  color?: string;
}

type Props = PlayPauseIconProps & IProps;

export const PlayPauseControl: React.FC<Props> = React.memo((props) => {
  return (
    <TouchableOpacity testID="PlayPauseControl-button" disabled={props.isLoading} style={styles.playButton} onPress={() => props.onPressPlay()} hitSlop={defaultHitslop}>
      <View style={styles.controlPlay}>
        <PlayPauseIcon isLoading={props.isLoading} isDisabled={props.isLoading} isPlaying={props.isPlaying} size={props.size} color={props.iconColor} />
      </View>
    </TouchableOpacity>
  );
});

export const PlayPauseControlCircle: React.FC<Props> = React.memo((props) => {
  return (
    <TouchableOpacity
      testID="PlayPauseControlCircle-button"
      style={[styles.playButton, styles.playButtonCircle]}
      onPress={() => props.onPressPlay()}
      hitSlop={defaultHitslop}
      disabled={props.isDisabled}
    >
      <View style={styles.controlPlay}>
        <PlayPauseIcon isLoading={props.isLoading} isPlaying={props.isPlaying} size={props.size} color={props.iconColor} />
      </View>
    </TouchableOpacity>
  );
});

export const PlayPauseIcon: React.FC<PlayPauseIconProps> = React.memo((props) => {
  if (props.isLoading) { return <ActivityIndicator color={(props.color === colors.white) ? colors.white : colors.black} />; }
  if (props.isPlaying) { return <Icon.FontAwesome5 name="pause" color={props.color ? props.color : colors.white} size={props.size ? props.size : 16} />; }
  return <Icon.FontAwesome5 name="play" color={props.color ? props.color : colors.white} size={props.size ? props.size : 16} style={{ marginLeft: 3 }} />;
});
