import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

import colors from '../../constants/colors';

import * as Icon from '../../components/Icon';

import styles from './styles';

interface Props {
  isMoving?: boolean;
  isLoading?: boolean;
  isPlaying?: boolean;
  isActive?: boolean;
  isDownloaded?: boolean;
  isFavorited?: boolean;
  isArchived?: boolean;
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
  onLongPress(): void;
  onPressOut(): void;
}

export const Article: React.FC<Props> = React.memo(({
  isMoving,
  isLoading,
  isPlaying,
  isActive,
  isDownloaded,
  isFavorited,
  isArchived,
  hasAudiofile,
  title,
  url,
  description,
  sourceName,
  authorName,
  listenTimeInSeconds,
  readingTime,
  onPlayPress,
  onOpenUrl,
  onLongPress,
  onPressOut
}) => (
  <View style={[styles.container, (isMoving) ? styles.isMoving : null]}>
    <TouchableOpacity style={styles.sectionHeader} activeOpacity={1} onPress={() => onOpenUrl(url)} onLongPress={onLongPress} onPressOut={onPressOut}>
      <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2} testID="article-title">{title}</Text>
    </TouchableOpacity>
    <View style={styles.sectionBody}>
      <TouchableOpacity style={styles.sectionMeta} activeOpacity={1} onPress={() => onOpenUrl(url)} onLongPress={onLongPress} onPressOut={onPressOut}>
        <View style={styles.source}>
          <Icon.FontAwesome5
            name="circle"
            size={9}
            solid
            style={styles.sourceIcon}
            color={hasAudiofile ? colors.green : colors.gray}
            testID="article-icon-playable"
          />
          <Icon.FontAwesome5
            name="arrow-alt-circle-down"
            size={9}
            solid
            style={styles.sourceIcon}
            color={isDownloaded ? colors.green : colors.gray}
            testID="article-icon-downloaded"
          />
          <Icon.FontAwesome5
            name="heart"
            size={9}
            solid
            style={styles.sourceIcon}
            color={isFavorited ? colors.favorite : colors.gray}
            testID="article-icon-favorited"
          />
          <Text style={styles.sourceName} ellipsizeMode="tail" numberOfLines={1} testID="article-source-name">
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
      {!props.isLoading && !props.isPlaying && <Icon.FontAwesome5 name="play" size={14} color="white" testID="article-icon-play" />}
      {!props.isLoading && props.isPlaying && <Icon.FontAwesome5 name="pause" size={14} color="white" testID="article-icon-pause" />}
    </View>
  </TouchableOpacity>
);
