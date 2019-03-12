import React from 'react';
import { Alert, NetInfo } from 'react-native';
import { Article } from './Article';
import TrackPlayer, { Track } from 'react-native-track-player';

import { PlaybackStatus } from '../../reducers/player';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isActive: boolean;
}

interface Props {
  playbackState: PlaybackStatus;
  track: Track;
  article: Api.Article;
  setTrack(track: Track, audiofile: Api.Audiofile): void;
  createAudiofile(articleId: string): void;
  seperated: boolean;
}

export class ArticleContainer extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isPlaying: false,
    isActive: false
  };

  componentDidUpdate(prevProps: Props) {
    const { playbackState, article } = this.props;
    const { isPlaying, isLoading, isActive } = this.state;

    // Get the first audiofile id
    const audiofileId = (article.audiofiles && article.audiofiles.length) ? article.audiofiles[0].id : null;

    // Updates for the current track
    if (prevProps.track.id === audiofileId) {
      // When a track is loaded into the player (downloading)
      if (playbackState && [TrackPlayer.STATE_BUFFERING].includes(playbackState) && !isLoading) {
        this.setState({ isActive: true, isLoading: true });
      }

      // When a track is playing, update the state so we can show it as playing
      if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
        this.setState({ isActive: true, isPlaying: true });
      }

      // When a track is loaded and ready to be played
      if (playbackState && ['ready', TrackPlayer.STATE_NONE, TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && (isLoading || isPlaying)) {
        this.setState({ isActive: true, isLoading: false, isPlaying: false });
      }
    } else {
      // When it's not the current track, reset the state if any is changed
      if (isPlaying || isLoading || isActive) {
        this.setState({
          isPlaying: false,
          isLoading: false,
          isActive: false
        });
      }
    }
  }

  /**
   * When a user tabs on the play button we:
   * 1. Play the audiofile if it's present
   * 2. Create an audiofile when there's none present
   * 3. Toggle play/pause
   */
  handleOnArticlePlayPress = async () => {
    const { isLoading, isPlaying } = this.state;
    const { article, setTrack, track } = this.props;

    if (isLoading) return Alert.alert('Wait, we are loading an audiofile...');

    const isConnected = await NetInfo.isConnected.fetch();

    if (!isConnected) return Alert.alert('You need are not connected to the internet. You need an active internet connection to listen to articles.');

    if (isPlaying) {
      return TrackPlayer.pause();
    }

    // If we don't have an audiofile yet, we create it first
    if (!article.audiofiles || !article.audiofiles.length) {
      return this.props.createAudiofile(article.id);
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
    }

    // Just play the track when we end up here
    return TrackPlayer.play();
  }

  render() {
    const { isLoading, isPlaying, isActive } = this.state;
    const { article, seperated } = this.props;

    const listenTimeInSeconds = (article.audiofiles && article.audiofiles.length && article.audiofiles[0].length) ? article.audiofiles[0].length : 0;

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
        listenTimeInSeconds={listenTimeInSeconds}
        onPlayPress={this.handleOnArticlePlayPress}
      />
    );
  }
}
