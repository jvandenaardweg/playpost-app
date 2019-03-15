import React from 'react';
import { View, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

import { ProgressBar } from '../../AudioPlayer';

import { Track } from 'react-native-track-player';

interface Props {
  onPressShowModal(): void;
  onPressPlay(): void;
  isPlaying: boolean;
  isLoading: boolean;
  track: Track;
}
export const AudioPlayerSmall = ({
  onPressShowModal,
  onPressPlay,
  isPlaying,
  isLoading,
  track: { title, artist, album }
}: Props) => (
  <View style={styles.wrapper}>
    <View style={styles.progressBarContainer}>
      <ProgressBar />
    </View>
    <View style={styles.container}>
      <TouchableHighlight style={styles.trackInfoButton} onPress={onPressShowModal}>
        <View style={styles.trackInfo}>
          <View>
            <Text style={styles.trackInfoTitle} ellipsizeMode="tail" numberOfLines={1}>{(title) ? title : 'Select an article'}</Text>
          </View>
          <View>
            <Text style={styles.trackInfoArtist} ellipsizeMode="tail" numberOfLines={1}>
              {(artist) ? artist : '-'}
              {' '}
              {' '}
              {album}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
      <View style={styles.sideIcon}>
        <TouchableHighlight style={styles.playButton} onPress={onPressPlay}>
          <View style={styles.controlPlay}>
            <PlayPauseIcon isLoading={isLoading} isPlaying={isPlaying} />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  </View>
);

const PlayPauseIcon = (props: { isPlaying: boolean, isLoading: boolean }) => {
  if (props.isLoading) return <ActivityIndicator />;
  if (props.isPlaying) return <Icon name="pause" color="white" size={16} />;
  return <Icon name="play" color="white" size={16} />;
};
