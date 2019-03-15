import React from 'react';
import { ActivityIndicator, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';

interface IProps {
  size?: number;
  onPressPlay(): void;
}

interface PlayPauseIconProps {
  isPlaying: boolean;
  isLoading: boolean;
  size?: number;
}

type Props = PlayPauseIconProps & IProps;

export const PlayPauseControl: React.FC<Props> = React.memo(({
  isPlaying,
  isLoading,
  size,
  onPressPlay
}) => {
  return (
    <TouchableHighlight style={styles.playButton} onPress={() => onPressPlay()}>
      <View style={styles.controlPlay}>
        <PlayPauseIcon isLoading={isLoading} isPlaying={isPlaying} size={size} />
      </View>
    </TouchableHighlight>
  );
});

const PlayPauseIcon: React.FC<PlayPauseIconProps>  = React.memo(({
  isPlaying,
  isLoading,
  size
}) => {

  if (isLoading) return <ActivityIndicator />;
  if (isPlaying) return <Icon name="pause" color="white" size={(size) ? size : 16} />;
  return <Icon name="play" color="white" size={(size) ? size : 16} />;
});
