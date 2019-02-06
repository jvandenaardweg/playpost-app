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

  getAudiofile = async (url) => {
    try {
      this.setState({isPlaying: false, isLoading: true})
      const audiofile = await fetch(`https://medium-audio.herokuapp.com/audiofile?url=${url}`).then((response) => response.json())
      this.setState({
        audiofileUrl: audiofile.publicFileUrl,
        isLoading: false
      })
      return audiofile
    } catch (err) {
      console.log(err)
      this.setState({ isLoading: false })
    }
  };

  handleOnArticlePlayPress = async (event) => {
    const { isLoading, isPlaying } = this.state
    const { url, id, title, authorName, sourceName, categoryName } = this.props.article

    if (isLoading) return alert('Wait, we are loading an audiofile...')

    if (isPlaying) return this.setState({isPlaying: false})

    const audiofile = await this.getAudiofile(url)

    const trackPlayload = {
      id: id,
      url: audiofile.publicFileUrl,
      title: title,
      artist: authorName,
      album: `${categoryName} on ${sourceName}`,
      // duration: 352
    }

    this.setState({isPlaying: true})

    alert(`Got audiofile, should add track to audioplayer: ${trackPlayload.url}`)


    // TODO: check if we got the correct audiofile on storage
    // TODO: if not, get audiofile from api
    // TODO: play audiofile
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
    <TouchableHighlight style={styles.controlButton} onPress={props.onPress} underlayColor={'red'}>
      <View>
        {props.isLoading && <ActivityIndicator size="small" color="#fff" />}
        {!props.isLoading && !props.isPlaying && <Icon name="play" size={14} color={'white'} style={styles.controlIcon}/>}
        {!props.isLoading && props.isPlaying && <Icon name="pause" size={14} color={'white'} style={styles.controlIcon}/>}
      </View>
    </TouchableHighlight>
  )
};

Article.propTypes = {
  article: PropTypes.object.isRequired
};
