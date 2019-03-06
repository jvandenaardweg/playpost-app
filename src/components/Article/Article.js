import React from 'react';
import {
  View, Text, TouchableHighlight, ActivityIndicator, TouchableOpacity, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import styles from './styles';

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
}) => (
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
            listenTimeInMinutes={listenTimeInMinutes}
          />
          <Text style={styles.duration}>
            {(listenTimeInMinutes).toFixed(0)}
            min
          </Text>
        </View>
      )}
    </View>
  </View>
);

export const PlayButton = ({ isPlaying, onPress, isLoading }) => (
  <TouchableHighlight
    style={[styles.controlButton, isPlaying ? styles.controlButtonActive : null]}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View>
      {isLoading && <ActivityIndicator size="small" color="#fff" />}
      {!isLoading && !isPlaying && <Icon name="play" size={14} color="white" style={styles.controlIcon} />}
      {!isLoading && isPlaying && <Icon name="pause" size={14} color="white" style={styles.controlIcon} />}
    </View>
  </TouchableHighlight>
);

Article.defaultProps = {
  isLoading: false,
  isPlaying: false,
  seperated: false,
  authorName: null,
  listenTimeInMinutes: 0,
  onPlayPress: null
};

Article.propTypes = {
  isLoading: PropTypes.bool,
  isPlaying: PropTypes.bool,
  seperated: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sourceName: PropTypes.string.isRequired,
  authorName: PropTypes.string,
  listenTimeInMinutes: PropTypes.number,
  onPlayPress: PropTypes.func
};
