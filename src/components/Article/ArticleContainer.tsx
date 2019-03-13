import React from 'react';
import { Alert } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import { connect } from 'react-redux';

import { NetworkContext } from '../NetworkProvider';
import { Article } from './Article';

import { getPlaylists, PlaylistsState } from '../../reducers/playlists';
import { setTrack, PlayerState, PlaybackStatus, createAudiofile } from '../../reducers/player';

import { getPlayerTrack, getPlayerPlaybackState } from '../../selectors/player';
import isEqual from 'react-fast-compare';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isActive: boolean;
}

interface Props {
  article: Api.Article;
  playbackState: PlaybackStatus;
  track: Track;
  setTrack(track: Track, audiofile: Api.Audiofile): void;
  createAudiofile(articleId: string): void;
  getPlaylists(): void;
  seperated: boolean;
}

export class ArticleContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isPlaying: false,
    isActive: false
  };

  static contextType = NetworkContext;

  /**
   * Manually determine when we should update an article.
   * Because this ArticleContainer is rendered in a list, we want to be careful with re-renders...
   * ...as this impacts performance.
   */
  shouldComponentUpdate(nextProps: Props) {
    const { isActive, isPlaying, isLoading } = this.state;

    // If there's a state change inside the component, always update it
    // So the active, playing or loading state is correctly updated on an external change
    if (isActive || isPlaying || isLoading) {
      return true;
    }

    // Only update the component if the currently playing track ID is equal to our article audiofile ID
    // In other words: when there's the current article is playing
    if (nextProps.track.id === this.audiofileId) {
      return true;
    }

    return false;
  }

  /**
   * A getter to get the audiofile ID of the article
   * In the future we allow multiple audiofiles (multiple voices)
   * But for now, just return the first audiofile
   */
  get audiofileId() {
    const { article } = this.props;
    return (article.audiofiles.length) ? article.audiofiles[0].id : null;
  }

  componentDidUpdate(prevProps: Props) {
    console.log('ArticleContainer update', prevProps.article.id);

    const { playbackState } = this.props;
    const { isPlaying, isLoading, isActive } = this.state;

    // Updates for the current track
    if (prevProps.track.id === this.audiofileId) {
      // When a track is loaded into the player (downloading)
      if (playbackState && [TrackPlayer.STATE_BUFFERING].includes(playbackState) && !isLoading) {
        console.log('Set state buffering');
        this.setState({ isActive: true, isLoading: true });
      }

      // When a track is playing, update the state so we can show it as playing
      if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
        console.log('Set state playing');
        this.setState({ isActive: true, isPlaying: true });
      }

      // When a track is loaded and ready to be played
      if (playbackState && ['ready', TrackPlayer.STATE_NONE, TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && (isLoading || isPlaying)) {
        console.log('Set state ready');
        this.setState({ isActive: true, isLoading: false, isPlaying: false });
      }
    } else {
      // When it's not the current track, reset the state if any is changed
      if (isPlaying || isLoading || isActive) {
        console.log('reset state');
        this.setState({
          isPlaying: false,
          isLoading: false,
          isActive: false
        });
      }
    }
  }

  async createAudiofile() {
    const { article } = this.props;

    try {
      await this.props.createAudiofile(article.id);
      await this.props.getPlaylists();

      // TODO: play it
    } catch (err) {
      Alert.alert(
        'Oops!',
        'There was a problem while getting the audio for this article.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.createAudiofile(),
          },
        ],
        { cancelable: true }
      );
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
    const { isConnected } = this.context;

    if (isLoading) return Alert.alert('Wait, we are loading an audiofile...');

    if (!isConnected) return Alert.alert('You need are not connected to the internet. You need an active internet connection to listen to articles.');

    if (isPlaying) {
      return TrackPlayer.pause();
    }

    // If we don't have an audiofile yet, we create it first
    if (!article.audiofiles || !article.audiofiles.length) {
      return this.createAudiofile();
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

  get listenTimeInSeconds() {
    const { article } = this.props;
    return (article.audiofiles && article.audiofiles.length && article.audiofiles[0].length) ? article.audiofiles[0].length : 0;
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
        listenTimeInSeconds={this.listenTimeInSeconds}
        onPlayPress={this.handleOnArticlePlayPress}
      />
    );
  }
}

const mapStateToProps = (state: { player: PlayerState, playlists: PlaylistsState }) => ({
  track: getPlayerTrack(state),
  playbackState: getPlayerPlaybackState(state)
});

const mapDispatchToProps = {
  setTrack,
  getPlaylists,
  createAudiofile
};

export const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleContainerComponent);
