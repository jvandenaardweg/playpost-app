import React, { useContext } from 'react';
// import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useProgress } from 'react-native-track-player';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import styles from './styles';

export const AudioPlayerSmallProgressBar: React.FC = React.memo(() => {
  const { theme } = useContext(UserThemeContext);
  const progress = useProgress();

  let percentage = 0;
  const { position, duration } = progress;

  if (position && duration) {
    percentage = position / duration;
  }
  return (
    <View style={styles(theme).container}>
      <View style={[styles(theme).progress, { width: `${percentage * 100}%` }]} />
    </View>
  )
});
