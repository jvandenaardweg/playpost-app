import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Track } from 'react-native-track-player';

import { ProgressBar } from '../ProgressBar';
import { PlayPauseControl } from '../PlayPauseControl';

import styles from './styles';

interface Props {
  isPlaying: boolean;
  isLoading: boolean;
  track: Track;
  articleText: string | null | undefined;
  onPressPlay(): void;
  onPressNext(): void;
  onPressPrevious(): void;
  onPressClose(): void;
}

export const AudioPlayerLarge: React.FC<Props> = React.memo(({
  isPlaying,
  isLoading,
  onPressPlay,
  onPressNext,
  onPressPrevious,
  onPressClose,
  track: { title, artist, album },
  articleText
}: Props) => (
  <View style={styles.wrapper}>
    <TouchableOpacity activeOpacity={1} onPress={onPressClose} style={styles.openCloseControl}>
      <Icon name="chevron-down" size={24} color="#fff" />
    </TouchableOpacity>
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.album}>{artist}</Text>
      </View>
      <View style={styles.scrollableContainer}>
        <ScrollView indicatorStyle="white">
          <View style={styles.scrollableContent}>
            <Text style={styles.contentText}>{articleText}</Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.controlsContainer}>
        <View style={styles.progressBarRow}>
          <ProgressBar />
        </View>
        <View style={styles.controlsRow}>
          <View><TouchableHighlight onPress={onPressPrevious}><Icon name="step-backward" size={22} color="#fff" /></TouchableHighlight></View>
          <View><PlayPauseControl size={52} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={onPressPlay} /></View>
          <View><TouchableHighlight onPress={onPressNext}><Icon name="step-forward" size={22} color="#fff" /></TouchableHighlight></View>
        </View>
      </View>
    </View>
  </View>
));
