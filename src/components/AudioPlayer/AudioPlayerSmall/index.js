import React from 'react';
import {
  View, Text, TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

export class AudioPlayerSmall extends React.PureComponent {
  renderEmptyState = () => (
    <Text style={styles.emptyText}>Select an article to listen</Text>
  )

  render() {
    const {
      handleOnShowModal, handleOnPressPlay, handleOnPressPause, isPlaying, track: { title, artist, album }
    } = this.props;

    return (
      <View style={styles.container}>
        {!title && this.renderEmptyState()}

        {title && (
          <>
            <TouchableHighlight style={styles.trackInfoButton} onPress={handleOnShowModal}>
              <View style={styles.trackInfo}>
                <View>
                  <Text style={styles.trackInfoTitle} ellipsizeMode="tail" numberOfLines={1}>{title}</Text>
                </View>
                <View>
                  <Text style={styles.trackInfoArtist} ellipsizeMode="tail" numberOfLines={1}>
                    {artist}
                    {' '}
-
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
  }
}

AudioPlayerSmall.defaultProps = {
  track: {
    title: 'Select an article',
    artist: '-'
  }
};

const PlayPauseIcon = ({ isPlaying }) => {
  if (isPlaying) return <Icon name="pause" color="white" size={10} />;
  return <Icon name="play" color="white" size={10} />;
};
