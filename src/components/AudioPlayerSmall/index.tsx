import React, { useContext } from 'react';
import { TouchableHighlight, View } from 'react-native';
import * as TrackPlayer from 'react-native-track-player';

import styles from './styles';

import colors from '../../constants/colors';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { AudioPlayerSmallProgressBar } from '../AudioPlayerSmallProgressBar';
import { PlayPauseControl } from '../PlayPauseControl';
import Text from '../Text';

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
}) => {
  const { theme } = useContext(UserThemeContext)

  return (
    <View testID="AudioPlayerSmall" style={styles(theme).wrapper}>
      <View style={styles(theme).container}>
        <TouchableHighlight style={styles(theme).trackInfoButton} onPress={onPressShowFullPlayer}>
          <View style={styles(theme).trackInfo}>
            <View>
              <Text testID="AudioPlayerSmall-Text-title" style={styles(theme).trackInfoTitle} ellipsizeMode="tail" numberOfLines={1} preset="footnoteEmphasized">{(title) ? title : 'Select an article'}</Text>
            </View>
            <View>
              <Text testID="AudioPlayerSmall-Text-meta" style={styles(theme).trackInfoArtist} ellipsizeMode="tail" numberOfLines={1} preset="caption2">
                {(artist) ? artist : '-'}
                {(album) ? `, ${album}` : null}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles(theme).rightIcon}>
          <PlayPauseControl size={16} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={onPressPlay} iconColor={colors.white} />
        </View>
      </View>
      <View style={styles(theme).progressBarContainer} pointerEvents="none">
        <AudioPlayerSmallProgressBar />
      </View>
    </View>
  )
})
