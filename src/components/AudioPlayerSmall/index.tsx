import React, { useContext } from 'react';
import isEqual from 'react-fast-compare';
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

export const AudioPlayerSmall: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext)

  return (
    <View testID="AudioPlayerSmall" style={styles(theme).wrapper}>
      <TouchableHighlight style={styles(theme).container} onPress={props.onPressShowFullPlayer}>
        <>
          <View style={styles(theme).trackInfoButton}>
            <View style={styles(theme).trackInfo}>
              <View>
                <Text testID="AudioPlayerSmall-Text-title" style={styles(theme).trackInfoTitle} ellipsizeMode="tail" numberOfLines={1} preset="footnoteEmphasized">{(props.track.title) ? props.track.title : 'Select an article'}</Text>
              </View>
              <View>
                <Text testID="AudioPlayerSmall-Text-meta" style={styles(theme).trackInfoArtist} ellipsizeMode="tail" numberOfLines={1} preset="caption2">
                  {(props.track.artist) ? props.track.artist : '-'}
                  {(props.track.album) ? `, ${props.track.album}` : null}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles(theme).rightIcon}>
            <PlayPauseControl size={16} isLoading={props.isLoading} isPlaying={props.isPlaying} onPressPlay={props.onPressPlay} iconColor={colors.white} />
          </View>
        </>
      </TouchableHighlight>
      <View style={styles(theme).progressBarContainer} pointerEvents="none">
        <AudioPlayerSmallProgressBar />
      </View>
    </View>
  )
}, isEqual)
