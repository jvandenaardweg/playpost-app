import Analytics from 'appcenter-analytics';
import React from 'react';
import isEqual from 'react-fast-compare';
import { Alert } from 'react-native';
import * as TrackPlayer from 'react-native-track-player';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import { LOCAL_CACHE_AUDIOFILES_PATH } from '../constants/files';
import {
  ALERT_ARTICLE_DOWNLOAD_FAIL,
  ALERT_ARTICLE_PLAY_DOWNLOAD_FAIL,
  ALERT_ARTICLE_PLAY_FAIL,
  ALERT_ARTICLE_PLAY_INTERNET_REQUIRED,
  ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL,
  ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL,
  ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL,
  ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL,
  ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL,
  ALERT_PLAYLIST_UPDATE_FAIL,
  ALERT_TITLE_ERROR,
  ALERT_TITLE_ERROR_NO_INTERNET
} from '../constants/messages';

import * as cache from '../cache';

import { NetworkContext } from '../contexts/NetworkProvider';

import { Article } from '../components/Article';
import { ArticleEmptyFailed, ArticleEmptyNew, ArticleEmptyProcessing } from '../components/ArticleEmpty';
import { SwipeableRow } from '../components/SwipeableRow';

import { RootState } from '../reducers';
import { setDownloadedAudiofile } from '../reducers/audiofiles';
import {
  createAudiofile,
  resetIsCreatingAudiofile,
  resetIsDownloadingAudiofile,
  resetPlaybackStatus,
  setIsCreatingAudiofile,
  setIsDownloadingAudiofile,
  setTrack
} from '../reducers/player';
import {
  archivePlaylistItem,
  favoritePlaylistItem,
  getPlaylist,
  removeArticleFromPlaylist,
  unArchivePlaylistItem,
  unFavoritePlaylistItem
} from '../reducers/playlist';

import { getUser } from '../reducers/user';
import { selectDownloadedAudiofiles } from '../selectors/audiofiles';
import { selectPlayerCurrentArticleId, selectPlayerPlaybackState, selectPlayerPreviousArticleId, selectPlayerTrack } from '../selectors/player';
import { selectUserIsEligibleForTrial, selectUserIsSubscribed } from '../selectors/user';
import { makeSelectedVoiceForLanguageName } from '../selectors/voices';

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
  isFavorited: boolean;
  isArchived: boolean;
  isMoving: boolean;
  onLongPress?(): void;
  onPressOut?(): void;
}

const initialState = {
  isLoading: false,
  isPlaying: false,
  isActive: false,
  isCreatingAudiofile: false,
  isDownloadingAudiofile: false
};

export type Props = IProps & StateProps & DispatchProps;

export class ArticleContainerComponent extends React.Component<Props, State> {

  static contextType = NetworkContext;
  state = initialState;

  get audiofileToUse(): Api.Audiofile | undefined {
    const { isSubscribed, article } = this.props;
    const audiofile = isSubscribed ? this.getAudiofileByUserSelectedVoice() : article.audiofiles[0];
    return audiofile;
  }

  get listenTimeInSeconds(): number {
    const { article } = this.props;
    // Just get the listen time of the first audiofile, for now
    return article.audiofiles[0] && article.audiofiles[0].length ? article.audiofiles[0].length : 0;
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // Make sure we update the article that's active or was previously active in the player
    // So we can update it' state (playing, paused, inactive etc...)
    const isCurrentArticleId = this.props.playerCurrentArticleId === this.props.article.id;
    const isPreviousArticleId = this.props.playerPreviousArticleId === this.props.article.id;

    // Only update when props or state change
    return isCurrentArticleId || isPreviousArticleId || !isEqual(this.state, nextState) || !isEqual(this.props, nextProps) ;
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const { playbackState, playerCurrentArticleId, article } = this.props;
    const { isLoading, isCreatingAudiofile, isDownloadingAudiofile } = this.state;

    const isCurrentArticleId = playerCurrentArticleId === article.id;
    const hasSomethingLoading = isCreatingAudiofile || isDownloadingAudiofile;

    // If the article is not active in the player
    // And if the state is different from the initial state
    // Reset it, because the track became inactive
    if (!isCurrentArticleId && !hasSomethingLoading && !isLoading && !isEqual(this.state, initialState)) {
      return this.setState(initialState);
    }

    if (!hasSomethingLoading && isCurrentArticleId) {
      // When a track is playing
      if (playbackState && [TrackPlayer.State.Playing].includes(playbackState) && !prevState.isPlaying) {
        this.setState({ isPlaying: true, isActive: true, isLoading: false });
      }

      // When a track is stopped or paused
      if (playbackState && [TrackPlayer.State.Stopped, TrackPlayer.State.Paused].includes(playbackState) && prevState.isPlaying) {
        this.setState({ isPlaying: false, isActive: true });
      }
    }
  }

  /**
   * Find the audiofile in this article using the user's selected voice
   */
  getAudiofileByUserSelectedVoice(): Api.Audiofile | undefined {
    const { article, selectedVoiceForLanguageName } = this.props;
    const articleLanguageName = article.language ? article.language.name : '';

    if (!articleLanguageName) {
      return undefined;
    }

    if (!selectedVoiceForLanguageName) {
      return undefined;
    }

    // Else, just return the default voice audio
    return article.audiofiles.find(audiofile => audiofile.voice.id === selectedVoiceForLanguageName.id);
  }

  /**
   * When a user tabs on the play button we:
   * 1. Play the audiofile if it's present
   * 2. Create an audiofile when there's none present
   * 3. Toggle play/pause
   */
  handleOnPlayPress = async () => {
    // requestAnimationFrame(() => {
      const { isPlaying } = this.state;
      const { article, isSubscribed, playerCurrentArticleId } = this.props;
      const { isConnected } = this.context;

      // Toggle play/pause
      if (isPlaying) { return TrackPlayer.default.pause(); }

      // If there are no audiofiles and when there's no internet connection
      // Show the user he needs an active internet connection to listen to articles
      if (!article.audiofiles.length && !isConnected) {
        return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
      }

      // If we don't have an audiofile yet, we create it first
      // Which voice to use for this user is determined on the API
      if (!article.audiofiles.length) {
        return this.handleCreateAudiofile();
      }

      // When we end up here, it means the article already has an audiofile

      // TODO: check if an article has the same voice as the user has

      // If he user is subscribed, but it has no audio for it's selected voice, we create an audiofile
      if (isSubscribed && !this.getAudiofileByUserSelectedVoice()) {
        return this.handleCreateAudiofile();
      }

      // Temporary commented out below to allow playing of high quality voices on free accounts as an introduction
      //
      // If the user is on a free account, check if available audiofile uses different voice. Show alert if it does.
      // if (!isSubscribed) {
      //   this.alertIfDifferentSelectedVoice();
      // }

      // Only set a new track when it's a different one
      // handleSetTrack will also handle the download of the audio
      if (playerCurrentArticleId !== article.id) {
        return this.handleSetTrack();
      }

      // If we end up here, it means the audio is already in the player, we just play it then
      return TrackPlayer.default.play();
    // });
  }

  handleCreateAudiofile = async (): Promise<void> => {
    const { article } = this.props;

    // Create the audiofile using our API...
    this.setState({
      isPlaying: false,
      isLoading: true,
      isActive: true,
      isCreatingAudiofile: true
    });

    try {
      this.props.setIsCreatingAudiofile();

      await this.props.createAudiofile(article.id); // Create the audiofile using our API, this could take a little time

      // Get the user's updated playlist and usage data
      await Promise.all([
        this.props.getPlaylist(), // Get the playlist, it contains the article with the newly created audiofile
        this.props.getUser() // Get the user, so we can show up to date usage data
      ]);

      return this.handleSetTrack(); // Set the track. Upon track change, the track with automatically play.
    } catch (err) {
      this.setState({ isLoading: false, isActive: false });
    } finally {
      this.props.resetIsCreatingAudiofile();
      this.setState({ isCreatingAudiofile: false });
    }
  }

  get isDownloaded() {
    const { article, downloadedAudiofiles } = this.props;
    if (!article.audiofiles || !article.audiofiles.length) { return false; }

    const articleAudiofilesIds = article.audiofiles.map(audiofile => audiofile.id);

    return !!downloadedAudiofiles.find(audiofile => articleAudiofilesIds.includes(audiofile.id));
  }

  alertIfDifferentSelectedVoice = (): void => {
    const { article, playerCurrentArticleId, userIsEligibleForTrial } = this.props;

    const audiofileWithUsersSelectedVoice = this.getAudiofileByUserSelectedVoice();
    const selectedVoiceId = audiofileWithUsersSelectedVoice && audiofileWithUsersSelectedVoice.voice.id;
    const audiofileVoiceId = this.audiofileToUse && this.audiofileToUse.voice.id;
    const audiofileVoiceLabel = this.audiofileToUse && this.audiofileToUse.voice.label;
    const isAudioWithSameVoice = selectedVoiceId === audiofileVoiceId;
    const isArticlePlaying = playerCurrentArticleId === article.id;

    // Show an alert, only when the selected article is not playing yet
    if (!isAudioWithSameVoice && !isArticlePlaying) {
      Alert.alert(
        'Article has different voice',
        `Because you are on a free account, we will use the already available audio with the voice "${audiofileVoiceLabel}" for this article.\n\nYou can upgrade to always use your chosen voice.`,
        [
          {
            text: (userIsEligibleForTrial) ? 'Start free trial' : 'Upgrade',
            style: 'cancel',
            onPress: () => this.props.navigation.navigate('Upgrade')
          },
          {
            text: 'OK'
          }
        ]
      );
    }
  }

  downloadAudiofile = async (url: string, audiofileId: string, filename: string): Promise<string | void> => {
    return new Promise((resolve, reject) => {
      return this.setState({ isActive: true, isLoading: true, isDownloadingAudiofile: true }, async () => {
        try {
          this.props.setIsDownloadingAudiofile();
          const localFilePath = await cache.downloadArticleAudiofile(url, filename);
          resolve(localFilePath);
        } catch (err) {
          this.setState({ isLoading: false, isDownloadingAudiofile: false }, () => reject(err));
        } finally {
          this.props.resetIsDownloadingAudiofile();
          this.setState({ isDownloadingAudiofile: false });
        }
      });
    });
  }

  handleSetTrack = async (): Promise<void> => {
    const { isConnected } = this.context;
    const { article } = this.props;

    if (!article || !article.audiofiles.length) {
      return this.setState({ isActive: false, isLoading: false });
    }

    const audiofile = this.audiofileToUse ? this.audiofileToUse : null;

    if (!audiofile) { return Alert.alert(ALERT_TITLE_ERROR, 'no audio'); }

    if (!this.isDownloaded && !isConnected) {
      return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
    }

    return this.setState({ isActive: true, isLoading: true }, async () => {
      try {
        this.props.resetPlaybackStatus();

        const artist = article.authorName ? article.authorName : article.sourceName || '';
        const album = article.sourceName ? article.sourceName : '';

        let localAudiofilePath = cache.getLocalFilePath(audiofile.filename, LOCAL_CACHE_AUDIOFILES_PATH);

        if (!this.isDownloaded) {
          const downloadedLocalAudiofilePath = await this.downloadAudiofile(audiofile.url, audiofile.id, audiofile.filename);

          // Save the audiofile in store, so we can track which article has downloaded articles
          this.props.setDownloadedAudiofile(audiofile);

          if (downloadedLocalAudiofilePath) {
            localAudiofilePath = downloadedLocalAudiofilePath;
          } else {
            return this.setState({ isLoading: false }, () => {
              Alert.alert(ALERT_TITLE_ERROR, ALERT_ARTICLE_DOWNLOAD_FAIL);
            });
          }
        }

        if (localAudiofilePath) {
          const artwork = article.imageUrl || require('../assets/images/logo-1024.png');

          return this.props.setTrack(
            {
              artist,
              album,
              id: audiofile.id,
              title: article.title || '',
              url: localAudiofilePath,
              duration: audiofile.length,
              artwork,
              // contentType
              contentType: 'audio/mpeg',
              key: audiofile.id,
              pitchAlgorithm: TrackPlayer.PitchAlgorithm.Voice
            },
            article.id
          );
        }

        // IF we end up here, something above failed
        this.setState({ isActive: false, isLoading: false }, () => Alert.alert(ALERT_TITLE_ERROR, ALERT_ARTICLE_PLAY_FAIL))
      } catch (err) {
        this.setState({ isActive: false, isLoading: false });
        return Alert.alert(ALERT_TITLE_ERROR, ALERT_ARTICLE_PLAY_DOWNLOAD_FAIL);
      }
    });
  }

  fetchPlaylist = async (): Promise<void> => {
    try {
      await this.props.getPlaylist();
    } catch (err) {
      Alert.alert(ALERT_TITLE_ERROR, ALERT_PLAYLIST_UPDATE_FAIL, [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Try again',
          onPress: () => this.fetchPlaylist()
        }
      ]);
    }
  }

  handleRemoveArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.removeArticleFromPlaylist(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert(ALERT_TITLE_ERROR, ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL, [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Try again',
          onPress: () => this.handleRemoveArticle()
        }
      ]);
    }
  }

  handleArchiveArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.archivePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert(ALERT_TITLE_ERROR, ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL, [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Try again',
          onPress: () => this.handleArchiveArticle()
        }
      ]);
    }
  }

  handleFavoriteArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.favoritePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert(ALERT_TITLE_ERROR, ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL, [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Try again',
          onPress: () => this.handleFavoriteArticle()
        }
      ]);
    }
  }

  handleUnFavoriteArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.unFavoritePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert(ALERT_TITLE_ERROR, ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL, [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Try again',
          onPress: () => this.handleUnFavoriteArticle()
        }
      ]);
    }
  }

  handleUnArchiveArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.unArchivePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert(ALERT_TITLE_ERROR, ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL, [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Try again',
          onPress: () => this.handleUnArchiveArticle()
        }
      ]);
    }
  }

  handleOnOpenUrl = () => {
    requestAnimationFrame(() => {
      const { article } = this.props;
      this.props.navigation.navigate('FullArticle', { article })
    });
  }

  handleOnPressUpdate = (): void => {
    requestAnimationFrame(() => {
      this.setState({ isLoading: true }, async () => {
        try {
          await this.fetchPlaylist();
        } finally {
          this.setState({ isLoading: false });
        }
      });
    });
  }

  handleOnPressArticleIncompatible = () => {
    requestAnimationFrame(() => {
      Analytics.trackEvent('Article Press Incompatible');
      return this.props.navigation.navigate('ContentView');
    });
  }

  render(): JSX.Element {
    const { isCreatingAudiofile, isDownloadingAudiofile, isLoading, isPlaying, isActive } = this.state;
    const { article, isFavorited, isArchived, isMoving, onLongPress, onPressOut, playlistItem } = this.props;

    // Use the canonicalUrl if we have it, else fall back to the normal url
    const articleUrl = article.canonicalUrl ? article.canonicalUrl : article.url;
    const textDirection = (article.language && article.language.rightToLeft) ? 'rtl' : 'ltr';

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
        {article.status === 'failed' && <ArticleEmptyFailed isLoading={false} url={articleUrl} />}

        {article.status === 'crawling' && <ArticleEmptyProcessing isLoading={isLoading} onPressUpdate={this.handleOnPressUpdate} url={articleUrl} />}

        {article.status === 'new' && <ArticleEmptyNew isLoading={isLoading} onPressUpdate={this.handleOnPressUpdate} url={articleUrl} />}

        {article.status === 'finished' && (
          <Article
            isMoving={isMoving}
            isLoading={isLoading || isCreatingAudiofile || isDownloadingAudiofile}
            isPlaying={isPlaying}
            isActive={isActive}
            isDownloaded={this.isDownloaded}
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
            textDirection={textDirection}
            onPlayPress={this.handleOnPlayPress}
            onOpenUrl={this.handleOnOpenUrl}
            onLongPress={onLongPress}
            onPressOut={onPressOut}
            onPressArticleIncompatible={this.handleOnPressArticleIncompatible}
            isCompatible={article.isCompatible}
          />
        )}
      </SwipeableRow>
    );
  }
}

interface StateProps {
  readonly track: ReturnType<typeof selectPlayerTrack>;
  readonly playbackState: ReturnType<typeof selectPlayerPlaybackState>;
  readonly isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
  readonly downloadedAudiofiles: ReturnType<typeof selectDownloadedAudiofiles>;
  readonly playerCurrentArticleId: ReturnType<typeof selectPlayerCurrentArticleId>;
  readonly playerPreviousArticleId: ReturnType<typeof selectPlayerPreviousArticleId>;
  readonly userIsEligibleForTrial: ReturnType<typeof selectUserIsEligibleForTrial>;
  readonly selectedVoiceForLanguageName: Api.Voice | undefined;
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
  readonly setIsCreatingAudiofile: typeof setIsCreatingAudiofile;
  readonly resetIsCreatingAudiofile: typeof resetIsCreatingAudiofile;
  readonly setIsDownloadingAudiofile: typeof setIsDownloadingAudiofile;
  readonly resetIsDownloadingAudiofile: typeof resetIsDownloadingAudiofile;
  readonly getUser: typeof getUser;
}

const mapStateToProps = (state: RootState, props: Props) => {
  // Makes the selector memoized accross multiple components
  // More info: https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances
  const selectSelectedVoiceForLanguageName = makeSelectedVoiceForLanguageName();
  const languageName = props.article.language ? props.article.language.name : '';

  return ({
    track: selectPlayerTrack(state),
    playbackState: selectPlayerPlaybackState(state),
    isSubscribed: selectUserIsSubscribed(state),
    downloadedAudiofiles: selectDownloadedAudiofiles(state),
    playerCurrentArticleId: selectPlayerCurrentArticleId(state),
    playerPreviousArticleId: selectPlayerPreviousArticleId(state),
    userIsEligibleForTrial: selectUserIsEligibleForTrial(state),
    selectedVoiceForLanguageName: selectSelectedVoiceForLanguageName(state, { languageName })
  });
}

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
  setDownloadedAudiofile,
  setIsCreatingAudiofile,
  resetIsCreatingAudiofile,
  setIsDownloadingAudiofile,
  resetIsDownloadingAudiofile,
  getUser
};

export const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(ArticleContainerComponent));
