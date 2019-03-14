import React from 'react';
import { Alert } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import { connect } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

import { NetworkContext } from '../NetworkProvider';
import { Article } from './Article';
import { AppleStyleSwipeableRow } from '../../components/SwipeableRow/AppleStyleSwipeableRow';

import { getPlaylists } from '../../reducers/playlists';
import { setTrack, PlaybackStatus, createAudiofile } from '../../reducers/player';

import { getPlayerTrack, getPlayerPlaybackState } from '../../selectors/player';
import { getAudiofileByArticleId } from '../../selectors/playlists';
import isEqual from 'react-fast-compare';
import { RootState } from '../../reducers';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isActive: boolean;
}

interface IProps extends NavigationInjectedProps {
  article: Api.Article;
  seperated: boolean;
}

type Props = IProps & StateProps & DispatchProps;

export class ArticleContainerComponent extends React.Component<Props, State> {
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
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { isActive, isPlaying, isLoading } = this.state;

    // If there's a state change inside the component, always update it
    // So the active, playing or loading state is correctly updated on an external change
    if (!isEqual(this.state, nextState) || isActive || isPlaying || isLoading) {
      return true;
    }

    // if (nextState.isActive || nextState.isPlaying || nextState.isLoading) {
    //   return true;
    // }

    if ((nextProps.track.id !== this.audiofileId) && (isActive || isPlaying || isLoading)) {
      return true;
    }

    if (nextProps.track.id === this.audiofileId && !isEqual(this.props, nextProps)) {
      return true;
    }

    // Only update the component if the currently playing track ID is equal to our article audiofile ID
    // In other words: when there's the current article is playing
    // if (nextProps.track.id === this.audiofileId) {
    //   return true;
    // }

    return false;
  }

  componentDidUpdate() {
    const { playbackState, audiofile } = this.props;
    const { isPlaying, isLoading } = this.state;
    // console.log('Update ArticleContainerComponent', this.props.article.id);

    // When a track is loaded into the player (downloading)
    if (playbackState && [TrackPlayer.STATE_BUFFERING].includes(playbackState) && !isLoading) {
      console.log('ArticleContainer', 'componentDidUpdate', 'Set state buffering');
      this.setState({ isActive: true, isLoading: true });
    }

    // When a track is playing, update the state so we can show it as playing
    if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
      console.log('ArticleContainer', 'componentDidUpdate', 'Set state playing');
      this.setState({ isActive: true, isPlaying: true });
    }

    // When a track is loaded and ready to be played
    if (playbackState && ['ready', TrackPlayer.STATE_NONE, TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && (isLoading || isPlaying)) {
      console.log('ArticleContainer', 'componentDidUpdate', 'Set state ready');
      this.setState({ isActive: true, isLoading: false, isPlaying: false });
    }

    // When a new audiofile is created for this article, load it into the player
    // if (!this.isActiveInPlayer && audiofile) {
    //   this.handleSetTrack();
    // }

    // When it's not the current track, reset the state if any is changed
    // So our play button returns to not-active
    // Only do this when there's an audiofile
    if (!this.isActiveInPlayer && audiofile) {
      console.log('ArticleContainer', 'componentDidUpdate', 'Reset local state');
      this.setState({
        isPlaying: false,
        isLoading: false,
        isActive: false
      });
    }
  }

  /**
   * A getter to get the audiofile ID of the article
   * In the future we allow multiple audiofiles (multiple voices)
   * But for now, just return the first audiofile
   */
  get audiofileId() {
    const { audiofile } = this.props;
    return (audiofile) ? audiofile.id : null;
  }

  get isActiveInPlayer() {
    const { track } = this.props;
    return track.id === this.audiofileId;
  }

  async handleCreateAudiofile() {
    const { article } = this.props;

    this.setState({ isLoading: true, isActive: true }, async () => {
      try {
        await this.props.createAudiofile(article.id);
        await this.props.getPlaylists(); // Get the playlist, it contains the article with the newly created audiofile
        this.handleSetTrack(); // Set the track. Upon track change, the track with automatically play.
      } catch (err) {
        this.setState({ isLoading: false, isActive: false });
        Alert.alert(
          'Oops!',
          'There was a problem while creating the audio for this article.',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Try again',
              onPress: () => this.handleCreateAudiofile(),
            },
          ],
          { cancelable: true }
        );
      }
    });
  }

  /**
   * When a user tabs on the play button we:
   * 1. Play the audiofile if it's present
   * 2. Create an audiofile when there's none present
   * 3. Toggle play/pause
   */
  handleOnPlayPress = async () => {
    const { isLoading, isPlaying } = this.state;
    const { audiofile } = this.props;
    const { isConnected } = this.context;

    if (isLoading) return Alert.alert('Wait, we are loading an audiofile...');

    if (!isConnected) return Alert.alert('You need are not connected to the internet. You need an active internet connection to listen to articles.');

    if (isPlaying) {
      return TrackPlayer.pause();
    }

    // If we don't have an audiofile yet, we create it first
    if (!audiofile) {
      return this.handleCreateAudiofile();
    }

    // Only set a new track when it's a different one
    if (!this.isActiveInPlayer) {
      return this.handleSetTrack();
    }

    // Just play the track when we end up here
    return TrackPlayer.play();
  }

  handleSetTrack() {
    const { article, audiofile } = this.props;

    if (!article || !audiofile) return Alert.alert('Oops!', 'Could not play the article. Please try again.');

    const artist = (article.authorName) ? article.authorName : article.sourceName;
    const album = (article.categoryName && article.sourceName) ? `${article.categoryName} on ${article.sourceName}` : '';
    const description = (album) ? album : '';

    return this.props.setTrack(
      {
        artist,
        album,
        description,
        id: audiofile.id,
        title: article.title,
        url: audiofile.url,
        duration: audiofile.length,
        contentType: 'audio/mpeg'
      },
      audiofile
    );
  }

  get listenTimeInSeconds() {
    const { audiofile } = this.props;
    return (audiofile && audiofile.length) ? audiofile.length : 0;
  }

  handleOnOpenUrl = (url: string) => this.props.navigation.navigate('Browser', { url });

  render() {
    const { isLoading, isPlaying, isActive } = this.state;
    const { article, seperated } = this.props;

    return (
      <AppleStyleSwipeableRow>
        <Article
          isLoading={isLoading}
          isPlaying={isPlaying}
          isActive={isActive}
          seperated={seperated}
          title={article.title}
          url={article.url}
          description={article.description}
          sourceName={article.sourceName}
          authorName={article.authorName}
          listenTimeInSeconds={this.listenTimeInSeconds}
          onPlayPress={this.handleOnPlayPress}
          onOpenUrl={this.handleOnOpenUrl}
        />
      </AppleStyleSwipeableRow>
    );
  }
}

interface StateProps {
  track: Track;
  playbackState: PlaybackStatus;
  audiofile: Api.Audiofile | null;
}

interface DispatchProps {
  setTrack(track: Track, audiofile: Api.Audiofile): void;
  createAudiofile(articleId: string): void;
  getPlaylists(): void;
}

const mapStateToProps = (state: RootState, props: Props): StateProps => ({
  track: getPlayerTrack(state),
  playbackState: getPlayerPlaybackState(state),
  audiofile: getAudiofileByArticleId(state, props.article.id)
});

const mapDispatchToProps: DispatchProps = {
  setTrack,
  getPlaylists,
  createAudiofile
};

export const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(ArticleContainerComponent));
