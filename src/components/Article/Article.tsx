import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import urlParse from 'url-parse';
import dateFns from 'date-fns';
import colors from '../../constants/colors';

import * as Icon from '../../components/Icon';

import styles from './styles';
import { Image } from 'react-native-elements';

interface Props {
  isMoving?: boolean;
  isLoading?: boolean;
  isPlaying?: boolean;
  isActive?: boolean;
  isDownloaded?: boolean;
  isFavorited?: boolean;
  isArchived?: boolean;
  hasAudiofile?: boolean;
  title?: string | null;
  url: string;
  playlistItemCreatedAt: Date;
  imageUrl?: string | null;
  description?: string | null;
  sourceName?: string | null;
  authorName?: string | null;
  listenTimeInSeconds?: number;
  readingTime?: number | null;
  onPlayPress(): void;
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
  playlistItemCreatedAt,
  imageUrl,
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
    <TouchableOpacity style={styles.sectionBody} activeOpacity={1} onPress={() => onOpenUrl(url)} onLongPress={onLongPress} onPressOut={onPressOut}>
      <View style={styles.bodyMeta}>
        <SourceText authorName={authorName} sourceName={sourceName} url={url} />
      </View>
      <View style={styles.bodyTitle}>
        <Text style={styles.bodyTitleText} testID="article-title">{title}</Text>
      </View>
      <View style={styles.bodyFooter}>
        <Icon.FontAwesome5
          name="circle"
          size={9}
          solid
          style={styles.bodySourceIcon}
          color={hasAudiofile ? colors.green : colors.gray}
          testID="article-icon-playable"
        />
        <Icon.FontAwesome5
          name="arrow-alt-circle-down"
          size={9}
          solid
          style={styles.bodySourceIcon}
          color={isDownloaded ? colors.green : colors.gray}
          testID="article-icon-downloaded"
        />
        <Icon.FontAwesome5
          name="heart"
          size={9}
          solid
          style={styles.bodySourceIcon}
          color={isFavorited ? colors.favorite : colors.gray}
          testID="article-icon-favorited"
        />
        <Text style={styles.bodyFooterText}>Added {dateFns.distanceInWords(new Date(), playlistItemCreatedAt)} ago</Text>
      </View>
    </TouchableOpacity>
    <View style={styles.sectionControl}>
      <View style={styles.imageContainer}>
        {imageUrl && <Image style={styles.image} source={{ uri: imageUrl }} placeholderStyle={styles.imagePlaceholder} />}
        <View style={styles.playButtonContainer}>
          <PlayButton
            isLoading={isLoading}
            isPlaying={isPlaying}
            isActive={isActive}
            onPress={onPlayPress}
          />
        </View>
      </View>
      <Duration listenTimeInSeconds={listenTimeInSeconds} readingTime={readingTime} />
    </View>
  </View>
));

const SourceText = (props: { authorName: Props['authorName'], sourceName: Props['sourceName'], url: Props['url']}) => {
  let text;

  if (props.authorName && props.sourceName) {
    text = `${props.authorName} on ${props.sourceName}`;
  } else if (props.authorName && !props.sourceName) {
    text = props.authorName;
  } else if (props.url) {
    text = urlParse(props.url).hostname;
  } else {
    text = 'Unknown source';
  }

  return (
    <Text style={styles.bodySourceText} ellipsizeMode="tail" numberOfLines={1} testID="article-source-name">
      {text}
    </Text>
  );
};

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
      {props.isLoading && <ActivityIndicator testID="article-activity-indicator" size="small" color={(props.isPlaying || props.isActive) ? '#fff' : '#000'} />}
      {!props.isLoading && !props.isPlaying && <Icon.FontAwesome5 name="play" size={11} color={(props.isPlaying || props.isActive) ? '#fff' : '#000'} testID="article-icon-play" />}
      {!props.isLoading && props.isPlaying && <Icon.FontAwesome5 name="pause" size={11} color={(props.isPlaying || props.isActive) ? '#fff' : '#000'} testID="article-icon-pause" />}
    </View>
  </TouchableOpacity>
);
