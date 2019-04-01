import React from 'react';
import { Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import isEqual from 'react-fast-compare';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

import { LOCAL_STORAGE_PATH } from '../../constants/files';

import { NetworkContext } from '../../contexts/NetworkProvider';

import { Article } from './Article';
import { AppleStyleSwipeableRow } from '../../components/SwipeableRow/AppleStyleSwipeableRow';

import { RootState } from '../../reducers';
import { getPlaylists, removeArticleFromPlaylist } from '../../reducers/playlists';
import { setTrack, PlaybackStatus, createAudiofile, resetPlaybackStatus } from '../../reducers/player';
import { setDownloadedAudiofile } from '../../reducers/audiofiles';

import { getPlayerTrack, getPlayerPlaybackState } from '../../selectors/player';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isActive: boolean;
  isCreatingAudiofile: boolean;
  isDownloadingAudiofile: boolean;
}

interface IProps extends NavigationInjectedProps {
  article: Api.Article;
  playlistId: string;
  isDownloaded: boolean;
}

type Props = IProps & StateProps & DispatchProps;

export class ArticleContainerComponent extends React.Component<Props, State> {
  state = {
    isLoading: false,
    isPlaying: false,
    isActive: false,
    isCreatingAudiofile: false,
    isDownloadingAudiofile: false
  };

  static contextType = NetworkContext;

  /**
   * Manually determine when we should update an article.
   * Because this ArticleContainer is rendered in a list, we want to be careful with re-renders...
   * ...as this impacts performance.
   */
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { isActive, isPlaying, isLoading, isCreatingAudiofile, isDownloadingAudiofile } = this.state;

    // Only update if playbackState changes for the audiofileId of this article
    if (this.props.playbackState !== nextProps.playbackState) {
      if (nextProps.track.id === (this.articleAudiofiles.length && this.articleAudiofiles[0].id)) {
        return true;
      }
    }

    // Rerender when the user empties the cache
    if (this.props.isDownloaded !== nextProps.isDownloaded) {
      return true;
    }

    // If there's a state change inside the component, always update it
    // So the active, playing or loading state is correctly updated on an external change
    if (!isEqual(this.state, nextState) || isActive || isPlaying || isLoading || isCreatingAudiofile || isDownloadingAudiofile) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    const { playbackState } = this.props;
    const { isPlaying, isLoading, isCreatingAudiofile, isDownloadingAudiofile } = this.state;
    // console.log('Update ArticleContainerComponent', this.props.article.audiofiles[0].id);

    if (!isCreatingAudiofile && !isDownloadingAudiofile) {
      // When a track is playing
      if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
        // console.log('ArticleContainer', 'componentDidUpdate', 'Set state playing, loading false');
        this.setState({ isPlaying: true, isLoading: false });
      }

      // When a track is stopped or paused
      if (playbackState && [TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && isPlaying) {
        // console.log('ArticleContainer', 'componentDidUpdate', 'Set playing false');
        this.setState({ isPlaying: false });
      }
    }

    // When it's not the current track, reset the state if any is changed
    // So our play button returns to not-active
    if (this.isActiveInPlayer && playbackState === 'none' && !isLoading) {
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

    if (article.languageCode !== 'en') {
      return Alert.alert('Language not supported', `In this version we only allow English articles. This article seems to have the language: ${article.languageCode}.`);
    }

    this.setState({ isPlaying: false, isLoading: true, isActive: true, isCreatingAudiofile: true }, async () => {
      try {
        await this.props.createAudiofile(article.id);
        await this.props.getPlaylists(); // Get the playlist, it contains the article with the newly created audiofile
        this.handleSetTrack(); // Set the track. Upon track change, the track with automatically play.
      } catch (err) {
        this.setState({ isLoading: false });
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
      } finally {
        this.setState({ isCreatingAudiofile: false });
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
    const { isPlaying } = this.state;
    const { article } = this.props;
    const { isConnected } = this.context;

    if (isPlaying) {
      return TrackPlayer.pause();
    }

    if (!article.audiofiles.length && !isConnected) {
      return Alert.alert('No internet', 'You need an active internet connection to listen to this article.');
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

  downloadAudiofile = async (url: string, articleId: string, audiofileId: string, encoding: Api.Audiofile['encoding']): Promise<string | void> => {
    // console.log('Downloading audiofile...');

    return new Promise((resolve, reject) => {
      return this.setState({ isActive: true, isLoading: true, isDownloadingAudiofile: true }, async () => {
        try {
          // Make sure the /audiofile path exists
          await RNFS.mkdir(LOCAL_STORAGE_PATH);

          let extension = 'mp3';

          if (encoding === 'OGG_OPUS') {
            extension = 'opus';
          }

          const localFilePath = `${LOCAL_STORAGE_PATH}/${audiofileId}.${extension}`;

          const result = await RNFetchBlob.config({ path: localFilePath }).fetch('GET', url);

          if (!result) return reject(new Error('File does not exist.'));

          resolve(`file://${localFilePath}`);

        } catch (err) {
          this.setState({ isLoading: false });

          return reject(Alert.alert(
            'Oops!',
            'There was a problem while downloading the audio for this article.',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'Try again',
                onPress: () => this.downloadAudiofile(url, articleId, audiofileId, encoding),
              },
            ],
            { cancelable: true }
          ));
        } finally {
          this.setState({ isDownloadingAudiofile: false });
        }
      });
    });
  }

  getLocalAudiofilePath = (audiofileId: string, encoding: Api.Audiofile['encoding']) => {
    let extension = 'mp3';

    if (encoding === 'OGG_OPUS') {
      extension = 'opus';
    }

    return `file://${LOCAL_STORAGE_PATH}/${audiofileId}.${extension}`;
  }

  handleSetTrack = async () => {
    const { isConnected } = this.context;
    const { article, isDownloaded } = this.props;

    if (!article || !this.articleAudiofiles.length) {
      this.setState({ isActive: false, isLoading: false });
      return Alert.alert('Oops!', 'Could not play the article. Please try again.');
    }

    this.props.resetPlaybackStatus();

    this.setState({ isActive: true, isLoading: true }, async () => {
      const artist = (article.authorName) ? article.authorName : article.sourceName;
      const album = (article.categoryName && article.sourceName) ? `${article.categoryName} on ${article.sourceName}` : '';

      const audiofile = this.articleAudiofiles[0];

      let localAudiofilePath = this.getLocalAudiofilePath(audiofile.id, audiofile.encoding);

      if (!isDownloaded) {
        if (!isConnected) return Alert.alert('No internet', 'You need an active internet connection to listen to this article.');

        const downloadedLocalAudiofilePath = await this.downloadAudiofile(audiofile.url, article.id, audiofile.id, audiofile.encoding);

        // Save the audiofile in store, so we can track which article has downloaded articles
        this.props.setDownloadedAudiofile(audiofile);

        if (downloadedLocalAudiofilePath) {
          localAudiofilePath = downloadedLocalAudiofilePath;
        } else {
          this.setState({ isLoading: false });
          return Alert.alert('Oops!', 'We could not download this article. Please try again.');
        }
      }

      if (localAudiofilePath) {
        return this.props.setTrack(
          {
            artist,
            album,
            id: audiofile.id,
            title: article.title,
            url: localAudiofilePath,
            duration: audiofile.length,
            artwork: require('../../assets/images/logo-1024.png'),
            // contentType
            contentType: 'audio/mpeg'
          }
        );
      }

      return Alert.alert('Oops!', 'We could not play this article. Please try again.');
    });
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

  handleOnOpenUrl = (url: string) => {
    const { article } = this.props;

    return this.props.navigation.navigate('Browser', { url, title: article.title });
  }

  render() {
    const { isCreatingAudiofile, isLoading, isPlaying, isActive } = this.state;
    const { article, isDownloaded } = this.props;

    // Use the canonicalUrl if we have it, else fall back to the normal url
    const articleUrl = (article.canonicalUrl) ? article.canonicalUrl : article.url;

    const hasAudiofile = article.audiofiles.length > 0;

    return (
      <AppleStyleSwipeableRow
        removeArticle={this.handleRemoveArticle}
      >
        <Article
          isLoading={isLoading || isCreatingAudiofile}
          isPlaying={isPlaying}
          isActive={isActive}
          isDownloaded={isDownloaded}
          hasAudiofile={hasAudiofile}
          title={article.title}
          url={articleUrl}
          description={article.description}
          sourceName={article.sourceName}
          authorName={article.authorName}
          listenTimeInSeconds={this.listenTimeInSeconds}
          readingTime={article.readingTime}
          onPlayPress={this.handleOnPlayPress}
          onOpenUrl={this.handleOnOpenUrl}
        />
      </AppleStyleSwipeableRow>
    );
  }
}

interface StateProps {
  track: TrackPlayer.Track;
  playbackState: PlaybackStatus;
}

interface DispatchProps {
  setTrack(track: TrackPlayer.Track): void;
  createAudiofile(articleId: string): void;
  getPlaylists(): void;
  removeArticleFromPlaylist(articleId: string, playlistId: string): void;
  resetPlaybackStatus(): void;
  setDownloadedAudiofile(audiofile: Api.Audiofile): void;
}

const mapStateToProps = (state: RootState): StateProps => ({
  track: getPlayerTrack(state),
  playbackState: getPlayerPlaybackState(state)
});

const mapDispatchToProps: DispatchProps = {
  setTrack,
  getPlaylists,
  createAudiofile,
  removeArticleFromPlaylist,
  resetPlaybackStatus,
  setDownloadedAudiofile
};

export const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(ArticleContainerComponent));
