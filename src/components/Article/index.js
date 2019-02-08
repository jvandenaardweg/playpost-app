import React from 'react';
import { View, Text, Button, TouchableHighlight, ActivityIndicator } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5'
import PropTypes from 'prop-types';

export class Article extends React.PureComponent {
  state = {
    isLoading: false,
    isPlaying: false,
    audiofileUrl: null
  };

  componentDidUpdate(prevProps) {
    const { playbackStatus, playingTrack, article } = this.props;

    if (
      playingTrack &&
      playbackStatus === 'playing' &&
      playingTrack.id === article.id
    ) {
      this.setState({isPlaying: true})
    } else {
      this.setState({isPlaying: false})
    }
  }

  handleOnArticlePlayPress = async (event) => {
    const { isLoading, isPlaying } = this.state
    const { url, id, title, authorName, sourceName, categoryName } = this.props.article

    if (isLoading) return alert('Wait, we are loading an audiofile...')

    if (isPlaying) {
      // TODO: should trigger to stop the audio player
      return this.setState({isPlaying: false})
    }

    this.props.getAudioByArticleUrl(url)

    // TODO: Should set track when audio file is in?
    this.props.setTrack({
      id: id,
      title: title,
      artist: authorName,
      album: `${categoryName} on ${sourceName}`
    })
  };

  render() {
    const { isLoading, isPlaying } = this.state;
    const { title, description, sourceName, authorName, categoryName, listenTimeInMinutes } = this.props.article;

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
                size={12}
                style={styles.sourceIcon}
              />
              {/* <Icon
                name='arrow-circle-down'
                size={12}
                style={styles.sourceIcon}
              /> */}
              <Text style={styles.sourceName}>{sourceName}</Text>
            </View>
            <Text style={styles.description} ellipsizeMode='tail' numberOfLines={2}>{description}</Text>
            <Text style={styles.author}>
              <Text style={styles.authorName}>{authorName}</Text> in <Text style={styles.publicationName}>{categoryName}</Text>
            </Text>
          </View>
          <View style={styles.sectionControl}>
            <PlayButton isLoading={isLoading} isPlaying={isPlaying} onPress={this.handleOnArticlePlayPress} listenTimeInMinutes={listenTimeInMinutes} />
            <Text style={styles.duration}>{(listenTimeInMinutes).toFixed(0)} min</Text>
          </View>
        </View>
      </View>
    );
  }
}

export const PlayButton = (props) => {
  return (
    <TouchableHighlight style={styles.controlButton} onPress={props.onPress} activeOpacity={0.9}>
      <View>
        {props.isLoading && <ActivityIndicator size="small" color="#fff" />}
        {!props.isLoading && !props.isPlaying && <Icon name="play" size={14} color={'white'} style={styles.controlIcon}/>}
        {!props.isLoading && props.isPlaying && <Icon name="pause" size={14} color={'white'} style={styles.controlIcon}/>}
      </View>
    </TouchableHighlight>
  )
};

Article.propTypes = {
  playingTrack: PropTypes.object,
  article: PropTypes.object.isRequired,
  getAudioByArticleUrl: PropTypes.func.isRequired,
  setTrack: PropTypes.func.isRequired
};
