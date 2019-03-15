import React from 'react';
import { Alert } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import { connect } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import isEqual from 'react-fast-compare';

import { NetworkContext } from '../../contexts/NetworkProvider';

import { Article } from './Article';
import { AppleStyleSwipeableRow } from '../../components/SwipeableRow/AppleStyleSwipeableRow';

import { RootState } from '../../reducers';
import { getPlaylists, removeArticleFromPlaylist } from '../../reducers/playlists';
import { setTrack, PlaybackStatus, createAudiofile } from '../../reducers/player';

import { getPlayerTrack, getPlayerPlaybackState, getPlayerAudiofile } from '../../selectors/player';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isActive: boolean;
  isCreatingAudiofile: boolean;
}

interface IProps extends NavigationInjectedProps {
  article: Api.Article;
  playlistId: string;
  seperated: boolean;
}

type Props = IProps & StateProps & DispatchProps;

export class ArticleContainerComponent extends React.Component<Props, State> {
  state = {
    isLoading: false,
    isPlaying: false,
    isActive: false,
    isCreatingAudiofile: false
  };

  static contextType = NetworkContext;

  /**
   * Manually determine when we should update an article.
   * Because this ArticleContainer is rendered in a list, we want to be careful with re-renders...
   * ...as this impacts performance.
   */
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { isActive, isPlaying, isLoading, isCreatingAudiofile } = this.state;

    // Only update if playbackState changes for the audiofileId of this article
    if (this.props.playbackState !== nextProps.playbackState) {
      if (nextProps.track.id === (this.articleAudiofiles.length && this.articleAudiofiles[0].id)) {
        return true;
      }
    }

    // If there's a state change inside the component, always update it
    // So the active, playing or loading state is correctly updated on an external change
    if (!isEqual(this.state, nextState) || isActive || isPlaying || isLoading || isCreatingAudiofile) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    const { playbackState } = this.props;
    const { isPlaying, isLoading, isCreatingAudiofile } = this.state;
    // console.log('Update ArticleContainerComponent', this.props.article.id);

    // When a track is loaded into the player (downloading)
    if (playbackState && [TrackPlayer.STATE_BUFFERING].includes(playbackState) && !isLoading) {
      // console.log('ArticleContainer', 'componentDidUpdate', 'Set state buffering');
      this.setState({ isActive: true, isLoading: true, isCreatingAudiofile: false });
    }

    // When a track is playing, update the state so we can show it as playing
    if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
      // console.log('ArticleContainer', 'componentDidUpdate', 'Set state playing');
      this.setState({ isActive: true, isPlaying: true, isCreatingAudiofile: false });
    }

    // When a track is loaded and ready to be played
    if (playbackState && ['ready', TrackPlayer.STATE_NONE, TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && (isLoading || isPlaying)) {
      // console.log('ArticleContainer', 'componentDidUpdate', 'Set state ready');
      this.setState({ isActive: true, isLoading: false, isPlaying: false, isCreatingAudiofile: false });
    }

    // When it's not the current track, reset the state if any is changed
    // So our play button returns to not-active
    if (!this.isActiveInPlayer && !isCreatingAudiofile) {
      // console.log('ArticleContainer', 'componentDidUpdate', 'Reset local state');
      this.setState({
        isPlaying: false,
        isLoading: false,
        isActive: false,
        isCreatingAudiofile: false
      });
    }
  }

  get articleAudiofiles() {
    const { article } = this.props;
    return article.audiofiles;
  }

  get isActiveInPlayer() {
    const { track } = this.props;

    if (!this.articleAudiofiles.length) return false;

    return track.id === this.articleAudiofiles[0].id;
  }

  async handleCreateAudiofile() {
    const { article } = this.props;

    this.setState({ isLoading: true, isActive: true, isCreatingAudiofile: true }, async () => {
      try {
        await this.props.createAudiofile(article.id);
        await this.props.getPlaylists(); // Get the playlist, it contains the article with the newly created audiofile
        this.handleSetTrack(); // Set the track. Upon track change, the track with automatically play.
      } catch (err) {
        this.setState({ isLoading: false, isActive: false, isCreatingAudiofile: false });
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
    const { article } = this.props;
    const { isConnected } = this.context;

    if (isLoading) return Alert.alert('Wait, we are loading an audiofile...');

    if (!isConnected) return Alert.alert('You need are not connected to the internet. You need an active internet connection to listen to articles.');

    if (isPlaying) {
      return TrackPlayer.pause();
    }

    // If we don't have an audiofile yet, we create it first
    if (!article.audiofiles.length) {
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
    const { article } = this.props;

    if (!article || !this.articleAudiofiles.length) return Alert.alert('Oops!', 'Could not play the article. Please try again.');

    const artist = (article.authorName) ? article.authorName : article.sourceName;
    const album = (article.categoryName && article.sourceName) ? `${article.categoryName} on ${article.sourceName}` : '';
    const description = (album) ? album : '';

    return this.props.setTrack(
      {
        artist,
        album,
        description,
        id: this.articleAudiofiles[0].id,
        title: article.title,
        url: this.articleAudiofiles[0].url,
        duration: this.articleAudiofiles[0].length,
        contentType: 'audio/mpeg'
      },
      this.articleAudiofiles[0],
      article
    );
  }

  fetchPlaylists = async () => {
    try {
      await this.props.getPlaylists();
    } catch (err) {
      Alert.alert(
        'Oops!',
        'We could get your up-to-date playlist.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.fetchPlaylists(),
          },
        ],
        { cancelable: true }
      );
    }

  }

  handleRemoveArticle = async () => {
    const articleId = this.props.article.id;
    const { playlistId } = this.props;

    try {
      await this.props.removeArticleFromPlaylist(articleId, playlistId);
      this.fetchPlaylists();
    } catch (err) {
      Alert.alert(
        'Oops!',
        'We could not remove this article from your playlist.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.handleRemoveArticle(),
          },
        ],
        { cancelable: true }
      );
    }
  }

  get listenTimeInSeconds() {
    // const { article } = this.props;

    return (this.articleAudiofiles[0] && this.articleAudiofiles[0].length) ? this.articleAudiofiles[0].length : 0;
  }

  handleOnOpenUrl = (url: string) => this.props.navigation.navigate('Browser', { url });

  render() {
    const { isLoading, isPlaying, isActive } = this.state;
    const { article, seperated } = this.props;

    return (
      <AppleStyleSwipeableRow
        removeArticle={this.handleRemoveArticle}
      >
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
  setTrack(track: Track, audiofile: Api.Audiofile, article: Api.Article): void;
  createAudiofile(articleId: string): void;
  getPlaylists(): void;
  removeArticleFromPlaylist(articleId: string, playlistId: string): void;
}

const mapStateToProps = (state: RootState): StateProps => ({
  track: getPlayerTrack(state),
  playbackState: getPlayerPlaybackState(state),
  audiofile: getPlayerAudiofile(state)
});

const mapDispatchToProps: DispatchProps = {
  setTrack,
  getPlaylists,
  createAudiofile,
  removeArticleFromPlaylist
};

export const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(ArticleContainerComponent));
