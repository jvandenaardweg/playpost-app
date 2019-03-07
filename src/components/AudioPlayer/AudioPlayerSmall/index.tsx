import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

interface Props {
  handleOnShowModal(): void
  handleOnPressPlay(): void
  handleOnPressPause(): void
  isPlaying: boolean
  track: any
  trackUrl: string | null
  isDisabled: boolean
}
export const AudioPlayerSmall = ({
  handleOnShowModal,
  handleOnPressPlay,
  handleOnPressPause,
  isPlaying,
  track: { title, artist, album }
}: Props) => (
  <View style={styles.container}>
    {!title && <EmptyPlayer />}

    {title && (
      <>
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
          <TouchableHighlight style={styles.playButton} onPress={(isPlaying) ? handleOnPressPause : handleOnPressPlay}>
            <View style={styles.controlPlay}>
              <PlayPauseIcon isPlaying={isPlaying} />
            </View>
          </TouchableHighlight>
        </View>
      </>
    )}

  </View>
);

const EmptyPlayer = () => (
  <Text style={styles.emptyText}>Select an article to listen</Text>
);

const PlayPauseIcon = (props: { isPlaying: boolean }) => {
  if (props.isPlaying) return <Icon name="pause" color="white" size={10} />;
  return <Icon name="play" color="white" size={10} />;
};
