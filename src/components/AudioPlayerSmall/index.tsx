import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import styles from './styles';

import colors from '../../constants/colors';
import { AudioPlayerSmallProgressBar } from '../AudioPlayerSmallProgressBar';
import { PlayPauseControl } from '../PlayPauseControl';

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
  <View style={styles.wrapper}>
    <View style={styles.container}>
      <TouchableHighlight style={styles.trackInfoButton} onPress={onPressShowFullPlayer}>
        <View style={styles.trackInfo}>
          <View>
            <Text style={styles.trackInfoTitle} ellipsizeMode="tail" numberOfLines={1}>{(title) ? title : 'Select an article'}</Text>
          </View>
          <View>
            <Text style={styles.trackInfoArtist} ellipsizeMode="tail" numberOfLines={1}>
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
