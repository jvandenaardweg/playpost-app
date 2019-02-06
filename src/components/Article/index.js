import React from 'react';
import { View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5'
import PropTypes from 'prop-types';

export class Article extends React.PureComponent {
  state = {
    isLoading: false,
    audiofileUrl: null
  };

  getAudiofile = async (url) => {
    try {
      this.setState({ isLoading: true })
      const audiofile = await fetch(`http://medium-audio.herokuapp.com/audiofile?url=${url}`).then((response) => response.json())
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

  handleOnPress = async (event) => {
    const { url } = this.props.article

    const audiofile = await this.getAudiofile(url)

    alert(`Got audiofile ${audiofile.publicFileUrl}`)

    // TODO: check if we got the correct audiofile on storage
    // TODO: if not, get audiofile from api
    // TODO: play audiofile
  };

  render() {
    const { isLoading } = this.state;
    const { title, description, sourceName, authorName, categoryName, listenTimeInMinutes } = this.props.article;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} ellipsizeMode='tail' numberOfLines={2}>{title}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.meta}>
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
          <View style={styles.control}>
            <TouchableOpacity style={styles.controlButton} onPress={this.handleOnPress}>
              {isLoading && <ActivityIndicator size="small" color="#fff" />}
              {!isLoading && <Icon
                name="play"
                size={14}
                color={'white'}
                style={styles.controlIcon}
              />}
            </TouchableOpacity>
            <Text style={styles.duration}>{(listenTimeInMinutes).toFixed(0)} min</Text>
          </View>
        </View>
      </View>
    );
  }
}

Article.propTypes = {
  article: PropTypes.object.isRequired
};
