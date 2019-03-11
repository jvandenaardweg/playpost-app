import React from 'react';
import { Alert } from 'react-native';
import { Article } from './Article';
import { Track } from 'react-native-track-player';

import { PlaybackStatus } from '../../reducers/player';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isActive: boolean;
}

interface Props {
  playbackStatus: PlaybackStatus;
  track: Track;
  article: Api.Article;
  setTrack(track: Track, audiofile: Api.Audiofile): void;
  seperated: boolean;
}

export class ArticleContainer extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isPlaying: false,
    isActive: false
  };

  componentDidUpdate(prevProps: Props) {
    const { playbackStatus, article } = this.props;
    const { isActive, isPlaying } = this.state;

    // Get the first audiofile id
    const audiofileId = (article.audiofiles && article.audiofiles.length) ? article.audiofiles[0].id : null;

    // Updates for the current track
    if (prevProps.track.id === audiofileId) {

      // When a user clicks on the play button of an article, we want to set it active
      if (!isActive) {
        this.setState({ isActive: true });
      }

      // When a track is playing, update the state so we can show it as playing
      if (playbackStatus && ['playing', 'loading', 'ready'].includes(playbackStatus) && !isPlaying) {
        this.setState({ isPlaying: true });
      }

      // If a track is not playing anymore, show it as not-playing
      if (playbackStatus && ['paused', 'stopped'].includes(playbackStatus) && isPlaying) {
        this.setState({ isPlaying: false });
      }
    } else {
      // When it's not the current track
    }
  }

  handleOnArticlePlayPress = async () => {
    const { isLoading, isPlaying } = this.state;
    const { article, setTrack, track } = this.props;

    if (isLoading) return Alert.alert('Wait, we are loading an audiofile...');

    if (isPlaying) {
      // TODO: should trigger to stop the audio player
      return this.setState({ isPlaying: false });
    }

    if (!article.audiofiles || !article.audiofiles.length) {
      return Alert.alert('No audiofile yet, first need to be generated.');
    }

    const audiofile = article.audiofiles[0];

    // Only set a new track when it's a different one
    if (track.id !== audiofile.id) {
      return setTrack(
        {
          id: audiofile.id,
          title: article.title,
          artist: article.authorName || 'Unknown author',
          album: `${article.categoryName || 'Unknown category'} on ${article.sourceName}`,
          url: audiofile.url
        },
        audiofile
      );
    } else {
      // TODO: just toggle play/pause
    }
  }

  render() {
    const { isLoading, isPlaying, isActive } = this.state;
    const { article, seperated } = this.props;

    return (
      <Article
        isLoading={isLoading}
        isPlaying={isPlaying}
        isActive={isActive}
        seperated={seperated}
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
