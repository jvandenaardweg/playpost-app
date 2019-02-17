import React from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { Article } from './Article';

export class ArticleContainer extends React.PureComponent {
  state = {
    isLoading: false,
    isPlaying: false
  };

  componentDidUpdate() {
    const { playbackStatus, playingTrack, article } = this.props;

    if (
      playingTrack
      && playbackStatus === 'playing'
      && playingTrack.id === article.id
    ) {
      this.setState({ isPlaying: true });
    } else {
      this.setState({ isPlaying: false });
    }
  }

  handleOnArticlePlayPress = async () => {
    const { isLoading, isPlaying } = this.state;
    const { article, getAudioByArticleUrl, setTrack } = this.props;

    if (isLoading) return Alert.alert('Wait, we are loading an audiofile...');

    if (isPlaying) {
      // TODO: should trigger to stop the audio player
      return this.setState({ isPlaying: false });
    }

    getAudioByArticleUrl(article.url);

    // TODO: Should set track when audio file is in?
    return setTrack({
      id: article.id,
      title: article.title,
      artist: article.authorName,
      album: `${article.categoryName} on ${article.sourceName}`
    });
  };

  render() {
    const { isLoading, isPlaying } = this.state;
    const { article } = this.props;

    return (
      <Article
        isLoading={isLoading}
        isPlaying={isPlaying}
        title={article.title}
        description={article.description}
        sourceName={article.sourceName}
        authorName={article.authorName}
        listenTimeInMinutes={article.listenTimeInMinutes}
        onPlayPress={this.handleOnArticlePlayPress}
      />
    );
  }
}

ArticleContainer.defaultProps = {
  playingTrack: {},
  article: {}
};

ArticleContainer.propTypes = {
  playingTrack: PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string
  }),
  article: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    sourceName: PropTypes.string,
    authorName: PropTypes.string,
    listenTimeInMinutes: PropTypes.number
  }),
  getAudioByArticleUrl: PropTypes.func.isRequired,
  setTrack: PropTypes.func.isRequired
};
