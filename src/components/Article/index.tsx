import { formatDistanceToNow, parseISO } from 'date-fns';
import React from 'react';
import { ActivityIndicator, StyleProp, Text, TextStyle, TouchableHighlight, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Image } from 'react-native-elements';
import urlParse from 'url-parse';

import colors from '../../constants/colors';

import * as Icon from '../../components/Icon';

import { TextDirection } from '../../typings';
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
  playlistItemCreatedAt: string;
  imageUrl?: string | null;
  description?: string | null;
  sourceName?: string | null;
  authorName?: string | null;
  listenTimeInSeconds?: number;
  readingTime?: number | null;
  isCompatible: boolean;
  textDirection: TextDirection;
  onPlayPress(): void;
  onOpenUrl(): void;
  onLongPress?(): void;
  onPressOut?(): void;
  onPressArticleIncompatible(): void;
}

export const Article: React.FC<Props> = React.memo(
  ({
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
    onPressOut,
    onPressArticleIncompatible,
    isCompatible,
    textDirection
  }) => {

    const textDirectionStyle: StyleProp<TextStyle> = { writingDirection: textDirection, flexDirection: (textDirection === 'rtl') ? 'row-reverse' : undefined };
    const rtlFlexDirectionStyle: StyleProp<ViewStyle> = { flexDirection: (textDirection === 'rtl') ? 'row-reverse' : 'row' };

    return (
      <TouchableHighlight
        style={[styles.container, isMoving ? styles.isMoving : null]}
        onPress={onOpenUrl}
        onLongPress={onLongPress}
        onPressOut={onPressOut}
        activeOpacity={0.9}
        underlayColor={colors.black}
      >
        <View style={styles.contentContainer}>
          <View style={styles.wrapper}>
            <View testID="Article-Button-section" style={styles.sectionBody}>
              <View style={styles.bodyMeta}>
                <View style={[styles.bodyMetaSource, textDirectionStyle]}>
                  <SourceText authorName={authorName} sourceName={sourceName} textDirection={textDirection} url={url} />
                </View>
              </View>
              <View style={styles.bodyTitle}>
                <Text style={[styles.bodyTitleText, textDirectionStyle]} testID="Article-title" ellipsizeMode="tail" numberOfLines={3}>
                  {title}
                </Text>
              </View>
              <View style={[styles.bodyFooter, textDirectionStyle, rtlFlexDirectionStyle]}>
                <View style={[styles.bodyFooterIcons, rtlFlexDirectionStyle]}>
                  <Icon.FontAwesome5
                    name="circle"
                    size={8}
                    solid
                    style={styles.bodySourceIcon}
                    color={hasAudiofile ? colors.green : '#ddd'}
                    testID="Article-PlayIcon-Icon-playable"
                  />
                  <Icon.FontAwesome5
                    name="arrow-alt-circle-down"
                    size={8}
                    solid
                    style={styles.bodySourceIcon}
                    color={isDownloaded ? colors.green : '#ddd'}
                    testID="Article-icon-downloaded"
                  />
                  <Icon.FontAwesome5
                    name="heart"
                    size={8}
                    solid
                    style={styles.bodySourceIcon}
                    color={isFavorited ? colors.favorite : '#ddd'}
                    testID="Article-icon-favorited"
                  />
                </View>
                <Text style={styles.bodyFooterText}>Added {formatDistanceToNow(parseISO(playlistItemCreatedAt))} ago</Text>
              </View>
            </View>
            <View style={styles.sectionControl}>
              <TouchableOpacity
                testID="Article-Button-play"
                style={styles.imageContainer}
                onPress={onPlayPress}
                disabled={isLoading}
              >
                {imageUrl && <Image style={styles.image} source={{ uri: imageUrl }} placeholderStyle={styles.imagePlaceholder} />}
                <View style={styles.playButtonContainer}>
                  <PlayIcon isLoading={isLoading} isPlaying={isPlaying} isActive={isActive} />
                </View>
              </TouchableOpacity>
              <Duration listenTimeInSeconds={listenTimeInSeconds} readingTime={readingTime} />
            </View>
          </View>
          {!isCompatible && (
            <TouchableHighlight
              testID="Article-Button-incompatibility-warning"
              style={styles.warningContainer}
              onPress={onPressArticleIncompatible}
              activeOpacity={0.8}
              underlayColor={colors.black}
            >
              <View style={styles.warningWrapper}>
                <View style={styles.warningText}>
                  <Text>This article</Text>
                  <Text style={styles.warningHighlight}>{' '}might{' '}</Text>
                  <Text>not be compatible for listening.</Text>
                </View>
                <Text style={styles.warningLink}>Learn more</Text>
              </View>
            </TouchableHighlight>
          )}
        </View>
      </TouchableHighlight>
    )
});

interface SourceTextProps { authorName: Props['authorName']; sourceName: Props['sourceName']; url: Props['url']; textDirection: Props['textDirection'] }

const SourceText: React.FC<SourceTextProps> = React.memo((props: SourceTextProps) => {
  let text;
  const textDirectionStyle: StyleProp<TextStyle> = { direction: props.textDirection, writingDirection: props.textDirection };

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
    <Text style={[styles.bodySourceText, textDirectionStyle]} ellipsizeMode="tail" numberOfLines={1} testID="Article-source-name">
      {text}
    </Text>
  );
});

interface DurationProps {
  listenTimeInSeconds?: number;
  readingTime?: number | null;
}

const Duration: React.FC<DurationProps> = React.memo((props: DurationProps) => {
  // During our tests, it seems that it takes about 10-20% longer to listen to an article, then to read one
  // So we manually adjust the readingTime
  const readingTimeToListenTimeMargin = 1.1;

  if (props.listenTimeInSeconds) {
    return <Text style={styles.duration} testID="Article-duration">{`${Math.ceil(props.listenTimeInSeconds / 60)} min.`}</Text>;
  }

  if (props.readingTime) {
    return <Text style={styles.duration} testID="Article-duration">{`${Math.ceil((props.readingTime * readingTimeToListenTimeMargin) / 60)} min.`}</Text>;
  }

  return (
    <Text style={styles.duration} testID="Article-duration">
      ? min.
    </Text>
  );
});

interface PlayIconProps {
  isPlaying?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
}

const PlayIcon: React.FC<PlayIconProps> = React.memo((props: PlayIconProps) => (
  <View style={[styles.controlButton, props.isPlaying || props.isActive ? styles.controlButtonActive : null]} testID="Article-PlayIcon-view">
    {props.isLoading && <ActivityIndicator testID="Article-PlayIcon-ActivityIndicator" size="small" color={props.isPlaying || props.isActive ? '#fff' : '#000'} />}
    {!props.isLoading && !props.isPlaying && (
      <Icon.FontAwesome5
        name="play"
        size={11}
        color={props.isPlaying || props.isActive ? '#fff' : '#000'}
        testID="Article-PlayIcon-Icon-play"
        style={{ marginLeft: 2 }}
      />
    )}
    {!props.isLoading && props.isPlaying && (
      <Icon.FontAwesome5 name="pause" size={11} color={props.isPlaying || props.isActive ? '#fff' : '#000'} testID="Article-PlayIcon-Icon-pause" />
    )}
  </View>
));
