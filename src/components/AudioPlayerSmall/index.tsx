import React from 'react';
import { TouchableHighlight, View } from 'react-native';
import * as TrackPlayer from 'react-native-track-player';

import styles from './styles';

import colors from '../../constants/colors';
import { AudioPlayerSmallProgressBar } from '../AudioPlayerSmallProgressBar';
import { PlayPauseControl } from '../PlayPauseControl';
import { Text } from '../Text';

interface Props {
  isPlaying: boolean;
  isLoading: boolean;
  track: TrackPlayer.Track;
  onPressShowFullPlayer(): void;
  onPressPlay(): void;
}

export const AudioPlayerSmall: React.FC<Props> = React.memo(({
  onPressShowFullPlayer,
  onPressPlay,
  isPlaying,
  isLoading,
  track: { title, artist, album }
}) => (
  <View testID="AudioPlayerSmall" style={styles.wrapper}>
    <View style={styles.container}>
      <TouchableHighlight style={styles.trackInfoButton} onPress={onPressShowFullPlayer}>
        <View style={styles.trackInfo}>
          <View>
            <Text testID="AudioPlayerSmall-Text-title" style={styles.trackInfoTitle} ellipsizeMode="tail" numberOfLines={1} preset="footnoteEmphasized">{(title) ? title : 'Select an article'}</Text>
          </View>
          <View>
            <Text testID="AudioPlayerSmall-Text-meta" style={styles.trackInfoArtist} ellipsizeMode="tail" numberOfLines={1} preset="caption2">
              {(artist) ? artist : '-'}
              {(album) ? `, ${album}` : null}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
      <View style={styles.rightIcon}>
        <PlayPauseControl size={16} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={onPressPlay} iconColor={colors.white} />
      </View>
    </View>
    <View style={styles.progressBarContainer} pointerEvents="none">
      <AudioPlayerSmallProgressBar />
    </View>
  </View>
));
