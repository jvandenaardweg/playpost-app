import React from 'react';
import { Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import isEqual from 'react-fast-compare';

import { LOCAL_CACHE_AUDIOFILES_PATH } from '../../constants/files';
import { ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL, ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL, ALERT_ARTICLE_AUDIOFILE_CREATE_FAIL, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED, ALERT_ARTICLE_AUDIOFILE_DOWNLOAD_FAIL, ALERT_ARTICLE_PLAY_FAIL, ALERT_ARTICLE_DOWNLOAD_FAIL, ALERT_PLAYLIST_UPDATE_FAIL, ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL, ALERT_ARTICLE_VOICE_FAIL, ALERT_ARTICLE_LANGUAGE_UNSUPPORTED } from '../../constants/messages';

import * as cache from '../../cache';

import { NetworkContext } from '../../contexts/NetworkProvider';

import { Article } from './Article';
import { AppleStyleSwipeableRow } from '../../components/SwipeableRow/AppleStyleSwipeableRow';
import { ArticleEmptyProcessing, ArticleEmptyFailed } from './ArticleEmpty';

import { RootState } from '../../reducers';
import { getPlaylist, removeArticleFromPlaylist, archivePlaylistItem, favoritePlaylistItem } from '../../reducers/playlist';
import { setTrack, PlaybackStatus, createAudiofile, resetPlaybackStatus } from '../../reducers/player';
import { setDownloadedAudiofile } from '../../reducers/audiofiles';

import { getPlayerTrack, getPlayerPlaybackState } from '../../selectors/player';
import { getDefaultFreeVoice, getDefaultPremiumVoice, getSelectedVoice } from '../../selectors/voices';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isActive: boolean;
  isCreatingAudiofile: boolean;
  isDownloadingAudiofile: boolean;
}

interface IProps extends NavigationInjectedProps {
  article: Api.Article;
  isDownloaded: boolean;
  isFavorited: boolean;
  isArchived: boolean;
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

    // If an article has updated information
    // For example: when the article status turns from "new" into "finished", so the article is crawled and
    // has information like; title, description etc...
    if (!isEqual(this.props.article, nextProps.article)) {
      return true;
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

    if (!isCreatingAudiofile && !isDownloadingAudiofile) {
      // When a track is playing
      if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !isPlaying) {
        this.setState({ isPlaying: true, isLoading: false });
      }

      // When a track is stopped or paused
      if (playbackState && [TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && isPlaying) {
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
    const { article, selectedVoice } = this.props;

    if (article.languageCode !== 'en') {
      return Alert.alert('Language not supported', `${ALERT_ARTICLE_LANGUAGE_UNSUPPORTED}. This article seems to have the language: ${article.languageCode}.`);
    }

    if (!selectedVoice || !selectedVoice.id) {
      return Alert.alert('Voice not ready', ALERT_ARTICLE_VOICE_FAIL);
    }

    this.setState({ isPlaying: false, isLoading: true, isActive: true, isCreatingAudiofile: true }, async () => {
      try {
        await this.props.createAudiofile(article.id, selectedVoice.id);
        await this.props.getPlaylist(); // Get the playlist, it contains the article with the newly created audiofile
        this.handleSetTrack(); // Set the track. Upon track change, the track with automatically play.
      } catch (err) {
        this.setState({ isLoading: false });
        Alert.alert(
          'Oops!',
          ALERT_ARTICLE_AUDIOFILE_CREATE_FAIL,
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
      return Alert.alert('No internet', ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
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

  downloadAudiofile = async (url: string, audiofileId: string, filename: string): Promise<string | void> => {
    // console.log('Downloading audiofile...');

    return new Promise((resolve, reject) => {
      return this.setState({ isActive: true, isLoading: true, isDownloadingAudiofile: true }, async () => {
        try {
          const localFilePath = await cache.downloadArticleAudiofile(url, filename);
          resolve(localFilePath);
        } catch (err) {
          this.setState({ isLoading: false });

          return reject(Alert.alert(
            'Oops!',
            ALERT_ARTICLE_AUDIOFILE_DOWNLOAD_FAIL,
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'Try again',
                onPress: () => this.downloadAudiofile(url, audiofileId, filename),
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

  handleSetTrack = async () => {
    const { isConnected } = this.context;
    const { article, isDownloaded } = this.props;

    if (!article || !this.articleAudiofiles.length) {
      this.setState({ isActive: false, isLoading: false });
      return Alert.alert('Oops!', ALERT_ARTICLE_PLAY_FAIL);
    }

    this.props.resetPlaybackStatus();

    this.setState({ isActive: true, isLoading: true }, async () => {
      const artist = (article.authorName) ? article.authorName : article.sourceName;
      const album = (article.sourceName) ? article.sourceName : '';

      const audiofile = this.articleAudiofiles[0];

      let localAudiofilePath = cache.getLocalFilePath(audiofile.filename, LOCAL_CACHE_AUDIOFILES_PATH);

      if (!isDownloaded) {
        if (!isConnected) return Alert.alert('No internet', ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);

        const downloadedLocalAudiofilePath = await this.downloadAudiofile(audiofile.url, audiofile.id, audiofile.filename);

        // Save the audiofile in store, so we can track which article has downloaded articles
        this.props.setDownloadedAudiofile(audiofile);

        if (downloadedLocalAudiofilePath) {
          localAudiofilePath = downloadedLocalAudiofilePath;
        } else {
          this.setState({ isLoading: false });
          return Alert.alert('Oops!', ALERT_ARTICLE_DOWNLOAD_FAIL);
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

      return Alert.alert('Oops!', ALERT_ARTICLE_PLAY_FAIL);
    });
  }

  fetchPlaylist = async () => {
    try {
      await this.props.getPlaylist();
    } catch (err) {
      Alert.alert(
        'Oops!',
        ALERT_PLAYLIST_UPDATE_FAIL,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.fetchPlaylist(),
          },
        ],
        { cancelable: true }
      );
    }

  }

  handleRemoveArticle = async () => {
    const articleId = this.props.article.id;

    try {
      await this.props.removeArticleFromPlaylist(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert(
        'Oops!',
        ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL,
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

  handleArchiveArticle = async () => {
    const articleId = this.props.article.id;

    try {
      await this.props.archivePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Oops!',
        ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.handleArchiveArticle(),
          },
        ],
        { cancelable: true }
      );
    }
  }

  handleFavoriteArticle = async () => {
    const articleId = this.props.article.id;

    try {
      await this.props.favoritePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Oops!',
        ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.handleFavoriteArticle(),
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

  get isProcessing() {
    const { article } = this.props;
    return article.status === 'crawling' || article.status === 'new';
  }

  get isFailed() {
    const { article } = this.props;
    return article.status === 'failed';
  }

  handleOnOpenUrl = (url: string) => {
    const { article } = this.props;

    return this.props.navigation.navigate('Browser', { url, title: article.title });
  }

  render() {
    const { isCreatingAudiofile, isLoading, isPlaying, isActive } = this.state;
    const { article, isDownloaded, isFavorited, isArchived } = this.props;

    // Use the canonicalUrl if we have it, else fall back to the normal url
    const articleUrl = (article.canonicalUrl) ? article.canonicalUrl : article.url;

    const hasAudiofile = article.audiofiles.length > 0;

    // If the article is not yet done processing, for example, when we are still crawling it
    // We show it as loading
    if (this.isProcessing) {
      return <ArticleEmptyProcessing onPressUpdate={() => this.fetchPlaylist()} url={articleUrl} />;
    }

    return (
      <AppleStyleSwipeableRow
        removeArticle={this.handleRemoveArticle}
        archiveArticle={this.handleArchiveArticle}
        favoriteArticle={this.handleFavoriteArticle}
      >
        {this.isFailed &&
          <ArticleEmptyFailed url={articleUrl} />
        }

        {!this.isFailed &&
          <Article
            isLoading={isLoading || isCreatingAudiofile}
            isPlaying={isPlaying}
            isActive={isActive}
            isDownloaded={isDownloaded}
            isFavorited={isFavorited}
            isArchived={isArchived}
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
        }

      </AppleStyleSwipeableRow>
    );
  }
}

interface StateProps {
  track: TrackPlayer.Track;
  playbackState: PlaybackStatus;
  defaultPremiumVoice: Api.Voice | undefined;
  defaultFreeVoice: Api.Voice | undefined;
  selectedVoice: Api.Voice | undefined;
}

interface DispatchProps {
  setTrack(track: TrackPlayer.Track): void;
  createAudiofile(articleId: string, voiceId: string): void;
  getPlaylist(): void;
  removeArticleFromPlaylist(articleId: string): void;
  archivePlaylistItem(articleId: string): void;
  favoritePlaylistItem(articleId: string): void;
  resetPlaybackStatus(): void;
  setDownloadedAudiofile(audiofile: Api.Audiofile): void;
}

const mapStateToProps = (state: RootState): StateProps => ({
  track: getPlayerTrack(state),
  playbackState: getPlayerPlaybackState(state),
  defaultPremiumVoice: getDefaultPremiumVoice(state),
  defaultFreeVoice: getDefaultFreeVoice(state),
  selectedVoice: getSelectedVoice(state)
});

const mapDispatchToProps: DispatchProps = {
  setTrack,
  getPlaylist,
  createAudiofile,
  removeArticleFromPlaylist,
  archivePlaylistItem,
  favoritePlaylistItem,
  resetPlaybackStatus,
  setDownloadedAudiofile
};

export const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(ArticleContainerComponent));
