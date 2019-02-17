import React from 'react';
import PropTypes from 'prop-types';
import { Article } from './Article';

export class ArticleContainer extends React.PureComponent {
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
      this.setState({isPlaying: true});
    } else {
      this.setState({isPlaying: false});
    }
  }

  handleOnArticlePlayPress = async (event) => {
    const { isLoading, isPlaying } = this.state
    const { url, id, title, authorName, sourceName, categoryName } = this.props.article

    if (isLoading) return alert('Wait, we are loading an audiofile...')

    if (isPlaying) {
      // TODO: should trigger to stop the audio player
      return this.setState({isPlaying: false});
    }

    this.props.getAudioByArticleUrl(url);

    // TODO: Should set track when audio file is in?
    this.props.setTrack({
      id: id,
      title: title,
      artist: authorName,
      album: `${categoryName} on ${sourceName}`
    });
  };

  render() {
    const { isLoading, isPlaying } = this.state;
    const { title, description, sourceName, authorName, categoryName, listenTimeInMinutes } = this.props.article;

    return (
      <Article
        isLoading={isLoading}
        isPlaying={isPlaying}
        title={title}
        description={description}
        sourceName={sourceName}
        authorName={authorName}
        categoryName={categoryName}
        listenTimeInMinutes={listenTimeInMinutes}
        onPlayPress={this.handleOnArticlePlayPress}
      />
    );
  }
}

ArticleContainer.propTypes = {
  playingTrack: PropTypes.object,
  article: PropTypes.object.isRequired,
  getAudioByArticleUrl: PropTypes.func.isRequired,
  setTrack: PropTypes.func.isRequired
};
