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
  seperated?: boolean;
  title: string;
  url: string;
  description: string;
  sourceName: string;
  authorName?: string | null;
  listenTimeInSeconds: number;
  readingTime: number | null;
  onPlayPress?(): void;
  onOpenUrl(url: string): void;
}

export const Article: React.FC<Props> = React.memo(({
  isLoading,
  isPlaying,
  isActive,
  isDownloaded,
  seperated,
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
  <View style={[styles.container, seperated ? styles.seperated : null]}>
    <TouchableOpacity style={styles.sectionHeader} activeOpacity={1} onPress={() => onOpenUrl(url)}>
      <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
    <View style={styles.sectionBody}>
      <TouchableOpacity style={styles.sectionMeta} activeOpacity={1} onPress={() => onOpenUrl(url)}>
        <View style={styles.source}>
          <Icon
            name="arrow-alt-circle-down"
            size={12}
            solid
            style={styles.downloadIcon}
            color={isDownloaded ? colors.tintColor : colors.grayLight}
          />
          {/* <Icon
            name="bookmark"
            size={10}
            solid
            style={styles.sourceIcon}
          /> */}
          <Text style={styles.sourceName}>
            {authorName && `${authorName} on `}
            {sourceName}
          </Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText} ellipsizeMode="tail" numberOfLines={3}>{description}</Text>
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

export const Duration = (props: { listenTimeInSeconds: number, readingTime: number | null }) => {
  if (props.listenTimeInSeconds) {
    return <Text style={styles.duration}>{`${Math.ceil(props.listenTimeInSeconds / 60)} min`}</Text>;
  }

  if (props.readingTime) {
    return <Text style={styles.duration}>{`${Math.ceil(props.readingTime / 60)} min`}</Text>;
  }

  return <Text style={styles.duration}>? min</Text>;
};

export const PlayButton = (props: { isPlaying?: boolean, onPress(): void, isLoading?: boolean, isActive?: boolean }) => (
  <TouchableOpacity
    style={[styles.controlButton, (props.isPlaying || props.isActive) ? styles.controlButtonActive : null]}
    onPress={props.onPress}
    activeOpacity={0.7}
    disabled={props.isLoading}
  >
    <View>
      {props.isLoading && <ActivityIndicator size="small" color="#fff" />}
      {!props.isLoading && !props.isPlaying && <Icon name="play" size={14} color="white" style={styles.controlIcon} />}
      {!props.isLoading && props.isPlaying && <Icon name="pause" size={14} color="white" style={styles.controlIcon} />}
    </View>
  </TouchableOpacity>
);
