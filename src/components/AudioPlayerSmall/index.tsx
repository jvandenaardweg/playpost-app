import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import styles from './styles';

import { AudioPlayerSmallProgressBar } from '../AudioPlayerSmallProgressBar';
import { PlayPauseControl } from '../PlayPauseControl';

interface Props {
  onPressShowModal(): void;
  onPressPlay(): void;
  isPlaying: boolean;
  isLoading: boolean;
  track: TrackPlayer.Track;
}

export const AudioPlayerSmall: React.FC<Props> = React.memo(({
  onPressShowModal,
  onPressPlay,
  isPlaying,
  isLoading,
  track: { title, artist, album }
}) => (
  <View style={styles.wrapper}>
    <View style={styles.container}>
      <TouchableHighlight style={styles.trackInfoButton} onPress={onPressShowModal}>
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
        <PlayPauseControl size={16} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={onPressPlay} />
      </View>
    </View>
    <View style={styles.progressBarContainer} pointerEvents="none">
      <AudioPlayerSmallProgressBar />
    </View>
  </View>
));
