import React, { useContext } from 'react';
import isEqual from 'react-fast-compare';
import { ActivityIndicator, StyleProp, TextStyle, TouchableHighlight, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Image } from 'react-native-elements';
import urlParse from 'url-parse';

import Text from '../Text';

import colors from '../../constants/colors';

import * as Icon from '../../components/Icon';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';
import { TextDirection } from '../../typings';
import styles from './styles';

export interface Props {
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
  voiceLabel: string;
  onPlayPress(): void;
  onOpenUrl(): void;
  onLongPress?(): void;
  onPressOut?(): void;
  onPressArticleIncompatible(): void;
}

export const Article: React.FC<Props> = React.memo((props) => {
    const { theme } = useContext(UserThemeContext)

    const textDirectionStyle: StyleProp<TextStyle> = { writingDirection: props.textDirection, flexDirection: (props.textDirection === 'rtl') ? 'row-reverse' : undefined };
    const rtlFlexDirectionStyle: StyleProp<ViewStyle> = { flexDirection: (props.textDirection === 'rtl') ? 'row-reverse' : 'row' };

    return (
      <TouchableHighlight
        style={[styles(theme).container, props.isMoving ? styles(theme).isMoving : null]}
        onPress={props.onOpenUrl}
        onLongPress={props.onLongPress}
        onPressOut={props.onPressOut}
        activeOpacity={0.9}
        underlayColor={colors.black}
      >
        <View style={styles(theme).contentContainer}>
          <View style={styles(theme).wrapper}>
            <View testID="Article-Button-section" style={styles(theme).sectionBody}>
              <View style={styles(theme).bodyTitle}>
                <Text style={[styles(theme).bodyTitleText, textDirectionStyle]} testID="Article-title" ellipsizeMode="tail" numberOfLines={4} preset="bodyEmphasized">
                  {props.title}
                </Text>
              </View>
              <SourceText authorName={props.authorName} sourceName={props.sourceName} textDirection={props.textDirection} url={props.url} />
              <View style={[styles(theme).bodyFooter, textDirectionStyle, rtlFlexDirectionStyle]}>
                <View style={[rtlFlexDirectionStyle]}>
                  <Icon.Feather
                    name={props.hasAudiofile ? 'download-cloud' : 'cloud-off'}
                    size={14}
                    style={styles(theme).bodySourceIcon}
                    color={props.isDownloaded ? colors.green : (theme === UserTheme.dark) ? colors.gray300 : colors.gray100}
                    testID="Article-icon-downloaded"
                  />
                </View>
                <View style={[styles(theme).bodyMetaSource, textDirectionStyle]}>
                  <Text style={[styles(theme).downloadText, { color: props.isDownloaded ? colors.green : (theme === UserTheme.dark) ? colors.gray300 : colors.gray100 }]} preset="footnote" testID="Article-Text-voiceLabel">{props.voiceLabel}</Text>
                </View>
              </View>
            </View>
            <View style={styles(theme).sectionControl}>
              <TouchableOpacity
                testID="Article-Button-play"
                style={styles(theme).imageContainer}
                onPress={props.onPlayPress}
                disabled={props.isLoading}
              >
                {props.imageUrl && <Image resizeMode="cover" containerStyle={styles(theme).image} source={{ uri: props.imageUrl }} placeholderStyle={styles(theme).imagePlaceholder} />}
                <View style={styles(theme).playButtonContainer}>
                  <PlayIcon isLoading={props.isLoading} isPlaying={props.isPlaying} isActive={props.isActive} />
                </View>
              </TouchableOpacity>
              <Duration listenTimeInSeconds={props.listenTimeInSeconds} readingTime={props.readingTime} isActive={props.isActive} />
            </View>
          </View>
          {!props.isCompatible && (
            <TouchableHighlight
              testID="Article-Button-incompatibility-warning"
              style={styles(theme).warningContainer}
              onPress={props.onPressArticleIncompatible}
              activeOpacity={0.8}
              underlayColor={colors.black}
            >
              <View style={styles(theme).warningWrapper}>
                <Text style={styles(theme).warningTextContainer}>
                  <Text style={styles(theme).warningText}>This article</Text>
                  <Text style={[styles(theme).warningHighlight, styles(theme).warningText]} fontWeight="bold">{' '}might{' '}</Text>
                  <Text style={styles(theme).warningText}>not be compatible for listening.{' '}</Text>
                  <Text style={[styles(theme).warningLink, styles(theme).warningText]}>Learn more</Text>
                </Text>
              </View>
            </TouchableHighlight>
          )}
        </View>
      </TouchableHighlight>
    )
}, isEqual);

interface SourceTextProps { authorName: Props['authorName']; sourceName: Props['sourceName']; url: Props['url']; textDirection: Props['textDirection'] }

const SourceText: React.FC<SourceTextProps> = React.memo((props: SourceTextProps) => {
  const { theme } = useContext(UserThemeContext)

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
    <Text
      style={[styles(theme).bodySourceText, textDirectionStyle]}
      ellipsizeMode="tail"
      numberOfLines={1}
      testID="Article-source-name"
      preset="footnote"
    >
      {text}
    </Text>
  );
});

interface DurationProps {
  listenTimeInSeconds?: number;
  readingTime?: number | null;
  isActive?: boolean;
}

const Duration: React.FC<DurationProps> = React.memo((props: DurationProps) => {
  const { theme } = useContext(UserThemeContext)

  // During our tests, it seems that it takes about 10-20% longer to listen to an article, then to read one
  // So we manually adjust the readingTime
  const readingTimeToListenTimeMargin = 1.2;

  const durationText = props.listenTimeInSeconds
  ? `${Math.ceil(props.listenTimeInSeconds / 60)} min.`
  : props.readingTime
    ? `${Math.ceil((props.readingTime * readingTimeToListenTimeMargin) / 60)} min.`
    : '? min.'

  return (
    <View style={[styles(theme).durationContainer, (props.isActive) ? styles(theme).durationContainerActive : undefined]}>
      <Text style={[styles(theme).durationText, (props.isActive) ? styles(theme).durationTextActive : undefined]} testID="Article-duration" preset="caption2Emphasized">{durationText}</Text>
    </View>
  )
});

interface PlayIconProps {
  isPlaying?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
}

const PlayIcon: React.FC<PlayIconProps> = React.memo((props: PlayIconProps) => {
  const { theme } = useContext(UserThemeContext)

  return (
    <View style={[styles(theme).controlButton, props.isPlaying || props.isActive ? styles(theme).controlButtonActive : null]} testID="Article-PlayIcon-view">
      {props.isLoading && <ActivityIndicator testID="Article-PlayIcon-ActivityIndicator" size="small" color={props.isPlaying || props.isActive ? colors.white : colors.black} />}
      {!props.isLoading && !props.isPlaying && (
        <Icon.FontAwesome5
          name="play"
          size={11}
          color={props.isPlaying || props.isActive ? colors.white : colors.black}
          testID="Article-PlayIcon-Icon-play"
          style={{ marginLeft: 2 }}
        />
      )}
      {!props.isLoading && props.isPlaying && (
        <Icon.FontAwesome5 name="pause" size={11} color={props.isPlaying || props.isActive ? colors.white : colors.black} testID="Article-PlayIcon-Icon-pause" />
      )}
    </View>
  )
});
