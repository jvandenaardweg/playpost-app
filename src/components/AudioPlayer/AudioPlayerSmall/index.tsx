import React from 'react';
import { View, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';
import { Track, ProgressComponent } from 'react-native-track-player';

interface Props {
  handleOnShowModal(): void;
  handleOnPressPlay(): void;
  isPlaying: boolean;
  isLoading: boolean;
  track: Track;
}
export const AudioPlayerSmall = ({
  handleOnShowModal,
  handleOnPressPlay,
  isPlaying,
  isLoading,
  track: { title, artist, album }
}: Props) => (
  <View style={styles.wrapper}>
    <View style={styles.progressBarWrapper}>
      <ProgressBar />
    </View>
    <View style={styles.container}>
      <TouchableHighlight style={styles.trackInfoButton} onPress={handleOnShowModal}>
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
        <TouchableHighlight style={styles.playButton} onPress={handleOnPressPlay}>
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

class ProgressBar extends ProgressComponent {
  render() {
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarProgress, { width: `${this.getProgress()}%` }]} />
      </View>
    );
  }
}
