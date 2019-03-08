import * as React from 'React';
import { View, Text, TouchableHighlight, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

interface Props {
  isLoading?: boolean
  isPlaying?: boolean
  seperated?: boolean
  title: string
  description: string
  sourceName: string
  authorName?: string | null
  listenTimeInMinutes?: number
  onPlayPress?(): void
}

export const Article = ({
  isLoading,
  isPlaying,
  seperated,
  title,
  description,
  sourceName,
  authorName,
  listenTimeInMinutes,
  onPlayPress
}: Props) => (
  <View style={[styles.container, seperated ? styles.seperated : null]}>
    <TouchableOpacity style={styles.sectionHeader} activeOpacity={1} onPress={() => Alert.alert('Should go to the browser...')}>
      <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
    <View style={styles.sectionBody}>
      <View style={styles.sectionMeta}>
        <View style={styles.source}>
          <Icon
            name="bookmark"
            size={10}
            style={styles.sourceIcon}
          />
          <Text style={styles.sourceName}>
            {authorName && `${authorName} on `}
            {sourceName}
          </Text>
        </View>
        <Text style={styles.description} ellipsizeMode="tail" numberOfLines={3}>{description}</Text>
      </View>
      {onPlayPress && (
        <View style={styles.sectionControl}>
          <PlayButton
            isLoading={isLoading}
            isPlaying={isPlaying}
            onPress={onPlayPress}
          />
          <Text style={styles.duration}>
            {listenTimeInMinutes && listenTimeInMinutes.toFixed(0)}
            min
          </Text>
        </View>
      )}
    </View>
  </View>
);

export const PlayButton = (props: { isPlaying?: boolean, onPress(): void, isLoading?: boolean }) => (
  <TouchableHighlight
    style={[styles.controlButton, props.isPlaying ? styles.controlButtonActive : null]}
    onPress={props.onPress}
    activeOpacity={0.9}
  >
    <View>
      {props.isLoading && <ActivityIndicator size="small" color="#fff" />}
      {!props.isLoading && !props.isPlaying && <Icon name="play" size={14} color="white" style={styles.controlIcon} />}
      {!props.isLoading && props.isPlaying && <Icon name="pause" size={14} color="white" style={styles.controlIcon} />}
    </View>
  </TouchableHighlight>
);
