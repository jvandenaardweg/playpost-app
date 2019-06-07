import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import urlParse from 'url-parse';
import dateFns from 'date-fns';

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
  title?: string | null;
  url: string;
  playlistItemCreatedAt: Date | string;
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
        <View style={styles.bodyMetaSource}>
          <SourceText authorName={authorName} sourceName={sourceName} url={url} />
        </View>
      </View>
      <View style={styles.bodyTitle}>
        <Text style={styles.bodyTitleText} testID="article-title" ellipsizeMode="tail" numberOfLines={3}>{title}</Text>
      </View>
      <View style={styles.bodyFooter}>
        <View style={styles.bodyFooterIcons}>
            <Icon.FontAwesome5
              name="circle"
              size={8}
              solid
              style={styles.bodySourceIcon}
              color={hasAudiofile ? colors.green : '#ddd'}
              testID="article-icon-playable"
            />
            <Icon.FontAwesome5
              name="arrow-alt-circle-down"
              size={8}
              solid
              style={styles.bodySourceIcon}
              color={isDownloaded ? colors.green : '#ddd'}
              testID="article-icon-downloaded"
            />
            <Icon.FontAwesome5
              name="heart"
              size={8}
              solid
              style={styles.bodySourceIcon}
              color={isFavorited ? colors.favorite : '#ddd'}
              testID="article-icon-favorited"
            />
          </View>
        <Text style={styles.bodyFooterText}>Added {dateFns.distanceInWords(new Date(), playlistItemCreatedAt)} ago</Text>
      </View>
    </TouchableOpacity>
    <View style={styles.sectionControl}>
      <TouchableOpacity style={styles.imageContainer} onPress={onPlayPress} activeOpacity={1} disabled={isLoading}>
        {imageUrl && <Image style={styles.image} source={{ uri: imageUrl }} placeholderStyle={styles.imagePlaceholder} />}
        <View style={styles.playButtonContainer}>
          <PlayIcon
            isLoading={isLoading}
            isPlaying={isPlaying}
            isActive={isActive}
          />
        </View>
      </TouchableOpacity>
      <Duration listenTimeInSeconds={listenTimeInSeconds} readingTime={readingTime} />
    </View>
  </View>
));

type SourceTextProps =  { authorName: Props['authorName'], sourceName: Props['sourceName'], url: Props['url']}

const SourceText: React.FC<SourceTextProps> = React.memo((props: SourceTextProps) => {
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
});

type DurationProps =  {
  listenTimeInSeconds?: number,
  readingTime?: number | null
};

const Duration: React.FC<DurationProps> = React.memo((props: DurationProps) => {
  // During our tests, it seems that it takes about 10-20% longer to listen to an article, then to read one
  // So we manually adjust the readingTime
  const readingTimeToListenTimeMargin = 1.10;

  if (props.listenTimeInSeconds) {
    return <Text style={styles.duration} testID="article-duration">{`${Math.ceil(props.listenTimeInSeconds / 60)} min.`}</Text>;
  }

  if (props.readingTime) {
    return <Text style={styles.duration} testID="article-duration">{`${Math.ceil((props.readingTime * readingTimeToListenTimeMargin) / 60)} min.`}</Text>;
  }

  return <Text style={styles.duration} testID="article-duration">? min.</Text>;
});

type PlayIconProps = {
  isPlaying?: boolean,
  isLoading?: boolean,
  isActive?: boolean
};

const PlayIcon: React.FC<PlayIconProps> = React.memo((props: PlayIconProps) => (
  <View
    style={[styles.controlButton, (props.isPlaying || props.isActive) ? styles.controlButtonActive : null]}
    testID="article-play-button">
    {props.isLoading && <ActivityIndicator testID="article-activity-indicator" size="small" color={(props.isPlaying || props.isActive) ? '#fff' : '#000'} />}
    {!props.isLoading && !props.isPlaying && <Icon.FontAwesome5 name="play" size={11} color={(props.isPlaying || props.isActive) ? '#fff' : '#000'} testID="article-icon-play" style={{ marginLeft: 2 }} />}
    {!props.isLoading && props.isPlaying && <Icon.FontAwesome5 name="pause" size={11} color={(props.isPlaying || props.isActive) ? '#fff' : '#000'} testID="article-icon-pause" />}
  </View>
));
