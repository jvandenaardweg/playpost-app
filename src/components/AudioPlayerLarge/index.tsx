import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import * as Icon from '../Icon';
import { AudioPlayerProgressBar } from '../AudioPlayerProgressBar';
import { PlayPauseControlCircle } from '../PlayPauseControl';
import { ArticleReader } from '../ArticleReader';

import { defaultHitslop } from '../../constants/buttons';
import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  isPlaying: boolean;
  isLoading: boolean;
  article: Api.Article | undefined;
  onPressPlay(): void;
  onPressClose(): void;
  onProgressChange(value: number): void;
}

export const AudioPlayerLarge: React.FC<Props> = React.memo((props: Props) => (
  <View style={styles.wrapper}>
    <TouchableOpacity activeOpacity={1} onPress={props.onPressClose} style={styles.openCloseControl} hitSlop={defaultHitslop}>
      <Icon.FontAwesome5 name="chevron-down" size={24} color="#fff" />
    </TouchableOpacity>
    <View style={styles.container}>
      <View style={styles.scrollableContainer}>
        <ArticleReader article={props.article} theme="dark" />
      </View>
      <View style={styles.controlsContainer}>
        <AudioPlayerProgressBar onProgressChange={props.onProgressChange} />
        <View style={styles.controlsRow}>
          <View>
            <PlayPauseControlCircle size={24} iconColor={colors.black} isLoading={props.isLoading} isPlaying={props.isPlaying} onPressPlay={props.onPressPlay} />
          </View>
        </View>
      </View>
    </View>
  </View>
));
