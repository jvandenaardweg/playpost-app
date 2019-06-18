import React from 'react';
import { Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import isEqual from 'react-fast-compare';

import { LOCAL_CACHE_AUDIOFILES_PATH } from '../constants/files';
import { ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL, ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL, ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL, ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL, ALERT_ARTICLE_AUDIOFILE_CREATE_FAIL, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED, ALERT_ARTICLE_AUDIOFILE_DOWNLOAD_FAIL, ALERT_ARTICLE_PLAY_FAIL, ALERT_ARTICLE_DOWNLOAD_FAIL, ALERT_PLAYLIST_UPDATE_FAIL, ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL, ALERT_ARTICLE_LANGUAGE_UNSUPPORTED } from '../constants/messages';

import * as cache from '../cache';

import { NetworkContext } from '../contexts/NetworkProvider';

import { Article } from '../components/Article';
import { SwipeableRow } from '../components/SwipeableRow';
import { ArticleEmptyProcessing, ArticleEmptyFailed, ArticleEmptyNew } from '../components/ArticleEmpty';

import { RootState } from '../reducers';
import { getPlaylist, removeArticleFromPlaylist, archivePlaylistItem, favoritePlaylistItem, unArchivePlaylistItem, unFavoritePlaylistItem } from '../reducers/playlist';
import { setTrack, createAudiofile, resetPlaybackStatus } from '../reducers/player';
import { setDownloadedAudiofile } from '../reducers/audiofiles';

import { selectPlayerTrack, selectPlayerPlaybackState } from '../selectors/player';
import { selectIsSubscribed } from '../selectors/subscriptions';
import { selectUserSelectedVoiceByLanguageName } from '../selectors/user';

interface State {
  isLoading: boolean;
  isPlaying: boolean;
  isActive: boolean;
  isCreatingAudiofile: boolean;
  isDownloadingAudiofile: boolean;
}

interface IProps extends NavigationInjectedProps {
  article: Api.Article;
  playlistItem: Api.PlaylistItem;
  isDownloaded: boolean;
  isFavorited: boolean;
  isArchived: boolean;
  isMoving: boolean;
  onLongPress(): void;
  onPressOut(): void;
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
      // TODO: when using multiple audiofiles, we need to adjust this
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

    // Re-render when playlist item for this article changes
    // For example: when the user favorites or archived an playlist item
    if (!isEqual(this.props.playlistItem, nextProps.playlistItem)) {
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

    // Find the active audiofile
    const audiofileIsActive = this.articleAudiofiles.find(audiofile => audiofile.id === track.id);

    return audiofileIsActive !== undefined;
  }

  async handleCreateAudiofile() {
    const { article } = this.props;

    const articleLanguageCode = article.language && article.language.languageCode;

    if (!articleLanguageCode || articleLanguageCode !== 'en') {
      return Alert.alert('Language not supported', `${ALERT_ARTICLE_LANGUAGE_UNSUPPORTED}. This article seems to have the language: ${articleLanguageCode}.`);
    }

    this.setState({ isPlaying: false, isLoading: true, isActive: true, isCreatingAudiofile: true }, async () => {
      try {
        await this.props.createAudiofile(article.id);
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
    const { article, userSelectedVoiceByLanguageName, isSubscribed } = this.props;
    const { isConnected } = this.context;

    if (isPlaying) {
      return TrackPlayer.pause();
    }

    if (!article.audiofiles.length && !isConnected) {
      return Alert.alert('No internet', ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
    }

    // If article's readingTime is greater then 5 minutes, show a warning to our free account user's they cannot listen to this.
    // if (article && article.readingTime && article.readingTime > 300) {
    //   return Alert.alert(
    //     'Upgrade to Premium',
    //     'This article is longer then 5 minutes, listening is only available for Premium users.',
    //     [
    //       {
    //         text: 'Cancel',
    //         style: 'cancel'
    //       },
    //       {
    //         text: 'Upgrade',
    //         onPress: () => {}
    //       }
    //     ]
    //   );
    // }

    // If we don't have an audiofile yet, we create it first
    if (!article.audiofiles.length) {
      // If the selected voice of the user, is a Premium voice, but the user has no Premium account active
      if (userSelectedVoiceByLanguageName && userSelectedVoiceByLanguageName.isPremium && !isSubscribed) {
        // Show an Alert he needs to change his default voice for the "userSelectedVoiceByLanguageName.name" language
        const selectedVoiceLanguageName = userSelectedVoiceByLanguageName.language.name;
        return Alert.alert(
          'Cannot use selected voice',
          `Your selected voice for this ${selectedVoiceLanguageName} article is a Premium voice, but you have no active Premium subscription. If you want to continue to use this voice you should upgrade again.`,
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Upgrade to Premium',
              onPress: () => this.props.navigation.navigate('Upgrade')
            },
            {
              text: `Change ${selectedVoiceLanguageName} voice`,
              onPress: () => this.props.navigation.navigate('SettingsVoices', { languageName: selectedVoiceLanguageName })
            }
          ],
          { cancelable: true }
        );
      }

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

    // TODO: when using multiple audiofiles, we need to adjust this
    const audiofile = this.articleAudiofiles[0];

    if (!article || !this.articleAudiofiles.length) {
      this.setState({ isActive: false, isLoading: false });
      return Alert.alert('Oops!', ALERT_ARTICLE_PLAY_FAIL);
    }

    if (!isDownloaded && !isConnected) return Alert.alert('No internet', ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);

    this.setState({ isActive: true, isLoading: true }, async () => {
      this.props.resetPlaybackStatus();

      const artist = (article.authorName) ? article.authorName : article.sourceName || '';
      const album = (article.sourceName) ? article.sourceName : '';

      let localAudiofilePath = cache.getLocalFilePath(audiofile.filename, LOCAL_CACHE_AUDIOFILES_PATH);

      if (!isDownloaded) {
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
            title: article.title || '',
            url: localAudiofilePath,
            duration: audiofile.length,
            artwork: require('../assets/images/logo-1024.png'),
            // contentType
            contentType: 'audio/mpeg',
            key: audiofile.id
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

  handleUnFavoriteArticle = async () => {
    const articleId = this.props.article.id;

    try {
      await this.props.unFavoritePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert(
        'Oops!',
        ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.handleUnFavoriteArticle(),
          },
        ],
        { cancelable: true }
      );
    }
  }

  handleUnArchiveArticle = async () => {
    const articleId = this.props.article.id;

    try {
      await this.props.unArchivePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert(
        'Oops!',
        ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.handleUnArchiveArticle(),
          },
        ],
        { cancelable: true }
      );
    }
  }

  get listenTimeInSeconds() {
    // TODO: when using multiple audiofiles, we need to adjust this
    return (this.articleAudiofiles[0] && this.articleAudiofiles[0].length) ? this.articleAudiofiles[0].length : 0;
  }

  handleOnOpenUrl = (url: string) => {
    const { article } = this.props;

    return this.props.navigation.navigate('FullArticle', { article });
  }

  handleOnPressUpdate = () => {
    this.setState({ isLoading: true }, async () => {
      try {
        await this.fetchPlaylist();
      } finally {
        this.setState({ isLoading: false });
      }
    });

  }

  render() {
    const { isCreatingAudiofile, isLoading, isPlaying, isActive } = this.state;
    const { article, isDownloaded, isFavorited, isArchived, isMoving, onLongPress, onPressOut, playlistItem } = this.props;

    // Use the canonicalUrl if we have it, else fall back to the normal url
    const articleUrl = (article.canonicalUrl) ? article.canonicalUrl : article.url;

    const hasAudiofile = article.audiofiles.length > 0;

    return (
      <SwipeableRow
        removeArticle={this.handleRemoveArticle}
        archiveArticle={this.handleArchiveArticle}
        favoriteArticle={this.handleFavoriteArticle}
        unArchiveArticle={this.handleUnArchiveArticle}
        unFavoriteArticle={this.handleUnFavoriteArticle}
        isFavorited={isFavorited}
        isArchived={isArchived}
      >
        {article.status === 'failed' &&
          <ArticleEmptyFailed isLoading={false} url={articleUrl} />
        }

        {article.status === 'crawling' &&
          <ArticleEmptyProcessing isLoading={isLoading} onPressUpdate={this.handleOnPressUpdate} url={articleUrl} />
        }

        {article.status === 'new' &&
          <ArticleEmptyNew isLoading={isLoading} onPressUpdate={this.handleOnPressUpdate} url={articleUrl} />
        }

        {article.status === 'finished' &&
          <Article
            isMoving={isMoving}
            isLoading={isLoading || isCreatingAudiofile}
            isPlaying={isPlaying}
            isActive={isActive}
            isDownloaded={isDownloaded}
            isFavorited={isFavorited}
            isArchived={isArchived}
            hasAudiofile={hasAudiofile}
            title={article.title}
            url={articleUrl}
            imageUrl={article.imageUrl}
            playlistItemCreatedAt={playlistItem.createdAt}
            description={article.description}
            sourceName={article.sourceName}
            authorName={article.authorName}
            listenTimeInSeconds={this.listenTimeInSeconds}
            readingTime={article.readingTime}
            onPlayPress={this.handleOnPlayPress}
            onOpenUrl={this.handleOnOpenUrl}
            onLongPress={onLongPress}
            onPressOut={onPressOut}
        />
        }
      </SwipeableRow>
    );
  }
}

interface StateProps {
  readonly track: ReturnType<typeof selectPlayerTrack>;
  readonly playbackState: ReturnType<typeof selectPlayerPlaybackState>;
  readonly isSubscribed: ReturnType<typeof selectIsSubscribed>;
  readonly userSelectedVoiceByLanguageName: ReturnType<typeof selectUserSelectedVoiceByLanguageName>;
}

interface DispatchProps {
  readonly setTrack: typeof setTrack;
  readonly createAudiofile: typeof createAudiofile;
  readonly getPlaylist: typeof getPlaylist;
  readonly removeArticleFromPlaylist: typeof removeArticleFromPlaylist;
  readonly archivePlaylistItem: typeof archivePlaylistItem;
  readonly favoritePlaylistItem: typeof favoritePlaylistItem;
  readonly unArchivePlaylistItem: typeof unArchivePlaylistItem;
  readonly unFavoritePlaylistItem: typeof unFavoritePlaylistItem;
  readonly resetPlaybackStatus: typeof resetPlaybackStatus;
  readonly setDownloadedAudiofile: typeof setDownloadedAudiofile;
}

const mapStateToProps = (state: RootState, props: Props) => ({
  track: selectPlayerTrack(state),
  playbackState: selectPlayerPlaybackState(state),
  isSubscribed: selectIsSubscribed(state),
  userSelectedVoiceByLanguageName: selectUserSelectedVoiceByLanguageName(state, (props.article.language) ? props.article.language.name : '')
});

const mapDispatchToProps: DispatchProps = {
  setTrack,
  getPlaylist,
  createAudiofile,
  removeArticleFromPlaylist,
  archivePlaylistItem,
  favoritePlaylistItem,
  unArchivePlaylistItem,
  unFavoritePlaylistItem,
  resetPlaybackStatus,
  setDownloadedAudiofile
};

export const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(ArticleContainerComponent));
