import React from 'react';
import { View, Text, Button, TouchableHighlight, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import { Badge } from 'react-native-elements';
import styles from './styles';

export const Article = ({
  isLoading,
  isPlaying,
  title,
  description,
  sourceName,
  authorName,
  categoryName,
  listenTimeInMinutes,
  onPlayPress
}) => {
  return (
    <View style={styles.article}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title} ellipsizeMode='tail' numberOfLines={2}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>
        <View style={styles.sectionMeta}>
          <View style={styles.source}>
            <Icon
              name='bookmark'
              size={10}
              style={styles.sourceIcon}
            />
            <Text style={styles.sourceName}>{authorName} on {sourceName}</Text>
          </View>
          <Text style={styles.description} ellipsizeMode='tail' numberOfLines={3}>{description}</Text>
        </View>
        <View style={styles.sectionControl}>
          <PlayButton isLoading={isLoading} isPlaying={isPlaying} onPress={onPlayPress} listenTimeInMinutes={listenTimeInMinutes} />
          <Text style={styles.duration}>{(listenTimeInMinutes).toFixed(0)} min</Text>
        </View>
      </View>
    </View>
  );
};

export const PlayButton = (props) => {
  return (
    <TouchableHighlight style={[styles.controlButton, props.isPlaying ? styles.controlButtonActive : null]} onPress={props.onPress} activeOpacity={0.9}>
      <View>
        {props.isLoading && <ActivityIndicator size="small" color="#fff" />}
        {!props.isLoading && !props.isPlaying && <Icon name="play" size={14} color={'white'} style={styles.controlIcon}/>}
        {!props.isLoading && props.isPlaying && <Icon name="pause" size={14} color={'white'} style={styles.controlIcon}/>}
      </View>
    </TouchableHighlight>
  );
};

Article.propTypes = {
  isLoading: PropTypes.bool,
  isPlaying: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sourceName: PropTypes.string.isRequired,
  authorName: PropTypes.string,
  categoryName: PropTypes.string,
  listenTimeInMinutes: PropTypes.number,
  onPlayPress: PropTypes.func
};
