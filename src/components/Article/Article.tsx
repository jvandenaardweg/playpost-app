import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';

import colors from '../../constants/colors';

interface Props {
  isLoading?: boolean;
  isPlaying?: boolean;
  isActive?: boolean;
  isDownloaded?: boolean;
  hasAudiofile?: boolean;
  title?: string;
  url: string;
  description?: string;
  sourceName?: string;
  authorName?: string | null;
  listenTimeInSeconds?: number;
  readingTime?: number | null;
  onPlayPress?(): void;
  onOpenUrl(url: string): void;
}

export const Article: React.FC<Props> = React.memo(({
  isLoading,
  isPlaying,
  isActive,
  isDownloaded,
  hasAudiofile,
  title,
  url,
  description,
  sourceName,
  authorName,
  listenTimeInSeconds,
  readingTime,
  onPlayPress,
  onOpenUrl
}) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.sectionHeader} activeOpacity={1} onPress={() => onOpenUrl(url)}>
      <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2} testID="article-title">{title}</Text>
    </TouchableOpacity>
    <View style={styles.sectionBody}>
      <TouchableOpacity style={styles.sectionMeta} activeOpacity={1} onPress={() => onOpenUrl(url)}>
        <View style={styles.source}>
          <Icon
            name="circle"
            size={11}
            solid
            style={styles.downloadIcon}
            color={hasAudiofile ? colors.green : colors.grayLight}
            testID="article-icon-playable"
          />
          <Icon
            name="arrow-alt-circle-down"
            size={11}
            solid
            style={styles.downloadIcon}
            color={isDownloaded ? colors.green : colors.grayLight}
            testID="article-icon-downloaded"
          />
          {/* <Icon
            name="bookmark"
            size={10}
            solid
            style={styles.sourceIcon}
          /> */}
          <Text style={styles.sourceName} testID="article-source-name">
            {authorName && `${authorName} on `}
            {sourceName}
          </Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText} ellipsizeMode="tail" numberOfLines={3} testID="article-description">{description}</Text>
        </View>
      </TouchableOpacity>
      {onPlayPress && (
        <View style={styles.sectionControl}>
          <PlayButton
            isLoading={isLoading}
            isPlaying={isPlaying}
            isActive={isActive}
            onPress={onPlayPress}
          />
          <Duration listenTimeInSeconds={listenTimeInSeconds} readingTime={readingTime} />
        </View>
      )}
    </View>
  </View>
));

export const Duration = (props: { listenTimeInSeconds?: number, readingTime?: number | null }) => {
  if (props.listenTimeInSeconds) {
    return <Text style={styles.duration} testID="article-duration">{`${Math.ceil(props.listenTimeInSeconds / 60)} min`}</Text>;
  }

  if (props.readingTime) {
    return <Text style={styles.duration} testID="article-duration">{`${Math.ceil(props.readingTime / 60)} min`}</Text>;
  }

  return <Text style={styles.duration} testID="article-duration">? min</Text>;
};

export const PlayButton = (props: { isPlaying?: boolean, onPress(): void, isLoading?: boolean, isActive?: boolean }) => (
  <TouchableOpacity
    style={[styles.controlButton, (props.isPlaying || props.isActive) ? styles.controlButtonActive : null]}
    onPress={props.onPress}
    activeOpacity={0.7}
    disabled={props.isLoading}
    testID="article-play-button"
  >
    <View>
      {props.isLoading && <ActivityIndicator testID="article-activity-indicator" size="small" color="#fff" />}
      {!props.isLoading && !props.isPlaying && <Icon name="play" size={14} color="white" testID="article-icon-play" style={styles.controlIcon} />}
      {!props.isLoading && props.isPlaying && <Icon name="pause" size={14} color="white" testID="article-icon-pause" style={styles.controlIcon} />}
    </View>
  </TouchableOpacity>
);
