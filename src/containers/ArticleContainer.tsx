import analytics from '@react-native-firebase/analytics';
import React from 'react';
import isEqual from 'react-fast-compare';
import { Alert } from 'react-native';
import * as TrackPlayer from 'react-native-track-player';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import { LOCAL_CACHE_AUDIOFILES_PATH } from '../constants/files';
import {
  ALERT_ARTICLE_DOWNLOAD_FAIL,
  ALERT_ARTICLE_PLAY_DOWNLOAD_FAIL,
  ALERT_ARTICLE_PLAY_INTERNET_REQUIRED,
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
  deleteArticleFromPlaylist,
  favoritePlaylistItem,
  unArchivePlaylistItem,
  unFavoritePlaylistItem
} from '../reducers/playlist';

import NavigationService from '../navigation/NavigationService';

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
  playlistItem: Api.PlaylistItem;
  isFavorited: boolean;
  isArchived: boolean;
  isMoving: boolean;
  onLongPress?(): void;
  onPressOut?(): void;
  onGetUser(): void;
  onGetPlaylist(): void;
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

  /**
   * Get's the audiofile to be used for this article.
   * If the user is subscribed, it will return the audiofile from the selected voice.
   * If the user is not subscribed, it will return the available premium audiofile voice, or just the first it can found.
   */
  get audiofileToUse(): Api.Audiofile | undefined {
    const { isSubscribed, playlistItem } = this.props;

    // Get a premium audiofile if it exists
    const premiumAudiofile = playlistItem.article.audiofiles.find(audiofile => audiofile.voice.isPremium);
    const unsubscribedAudiofile = premiumAudiofile ? premiumAudiofile : playlistItem.article.audiofiles[0];

    // Get the audiofile based on the user his selection when he is subscribed
    // If not subscribed, we'll use the audiofile from above
    if (isSubscribed) {
      return this.getAudiofileByUserSelectedVoice();
    }

    return unsubscribedAudiofile;
  }

  /**
   * Get's the voice to be used for this article.
   * If there are audiofiles to be used, it returns the voice from that audiofile.
   * Else it will return the voice the user has selected or the default voice for the language.
   */
  get voiceToUse(): Api.Voice | null {
    const { selectedVoiceForLanguageName } = this.props;

    if (this.audiofileToUse) {
      return this.audiofileToUse.voice;
    }

    if (selectedVoiceForLanguageName) {
      return selectedVoiceForLanguageName
    }

    return null;
  }

  /**
   * Get's the listening time in seconds based on the audiofile.
   * If no audiofile is found, it will return 0
   */
  get listenTimeInSeconds(): number {
    if (!this.audiofileToUse) {
      return 0;
    }

    return this.audiofileToUse.length;
  }

  static contextType = NetworkContext;

  state = initialState;

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // Make sure we update the article that's active or was previously active in the player
    // So we can update it' state (playing, paused, inactive etc...)
    const isCurrentArticleId = this.props.playerCurrentArticleId === this.props.playlistItem.article.id;
    const isPreviousArticleId = this.props.playerPreviousArticleId === this.props.playlistItem.article.id;

    // Only update when props or state change

    // Note: We need to update on every prop change so we can correctly show if the article is already downloaded or not
    return isCurrentArticleId || isPreviousArticleId || !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const { playbackState, playerCurrentArticleId, playlistItem } = this.props;
    const { isLoading, isCreatingAudiofile, isDownloadingAudiofile } = this.state;

    const isCurrentArticleId = playerCurrentArticleId === playlistItem.article.id;
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
        return this.setState({ isPlaying: true, isActive: true, isLoading: false });
      }

      // When a track is stopped or paused
      if (playbackState && [TrackPlayer.State.Stopped, TrackPlayer.State.Paused].includes(playbackState) && prevState.isPlaying) {
        return this.setState({ isPlaying: false, isActive: true });
      }
    }
  }

  /**
   * Find the audiofile in this article using the user's selected voice
   */
  getAudiofileByUserSelectedVoice(): Api.Audiofile | undefined {
    const { playlistItem, selectedVoiceForLanguageName } = this.props;
    const articleLanguageName = playlistItem.article.language ? playlistItem.article.language.name : '';

    if (!articleLanguageName) {
      return undefined;
    }

    if (!selectedVoiceForLanguageName) {
      return undefined;
    }

    // Else, just return the default voice audio
    return playlistItem.article.audiofiles.find(audiofile => audiofile.voice.id === selectedVoiceForLanguageName.id);
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
      const { playlistItem, isSubscribed, playerCurrentArticleId } = this.props;
      const { isConnected } = this.context;

      await analytics().logEvent('article_press_play', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url,
        isPlaying
      });

      // Toggle play/pause
      if (isPlaying) { return TrackPlayer.default.pause(); }

      // If there are no audiofiles and when there's no internet connection
      // Show the user he needs an active internet connection to listen to articles
      if (!playlistItem.article.audiofiles.length && !isConnected) {
        return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
      }

      // If we don't have an audiofile yet, we create it first
      // Which voice to use for this user is determined on the API
      if (!playlistItem.article.audiofiles.length) {
        return this.handleCreateAudiofile();
      }

      // When we end up here, it means the article already has an audiofile

      // TODO: check if an article has the same voice as the user has

      // If he user is subscribed, but it has no audio for it's selected voice, we create an audiofile
      if (isSubscribed && !this.getAudiofileByUserSelectedVoice()) {
        return this.handleCreateAudiofile();
      }

      // Only set a new track when it's a different one
      // handleSetTrack will also handle the download of the audio
      if (playerCurrentArticleId !== playlistItem.article.id) {
        return this.handleSetTrack();
      }

      // If we end up here, it means the audio is already in the player, we just play it then
      return TrackPlayer.default.play();
    // });
  }

  handleCreateAudiofile = async (): Promise<void> => {
    const { playlistItem } = this.props;

    // Create the audiofile using our API...
    this.setState({
      isPlaying: false,
      isLoading: true,
      isActive: true,
      isCreatingAudiofile: true
    });

    try {
      await analytics().logEvent('article_create_audiofile', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

      this.props.setIsCreatingAudiofile();

      await this.props.createAudiofile(playlistItem.article.id); // Create the audiofile using our API, this could take a little time

      // Get the user's updated playlist and usage data
      await Promise.all([
        this.props.onGetPlaylist(), // Get the playlist, it contains the article with the newly created audiofile
        this.props.onGetUser() // Get the user, so we can show up to date usage data
      ]);

      return this.handleSetTrack(); // Set the track. Upon track change, the track with automatically play.
    } catch (err) {
      this.setState({ isLoading: false, isActive: false });
    } finally {
      this.props.resetIsCreatingAudiofile();
      this.setState({ isCreatingAudiofile: false });
    }
  }

  getIsDownloaded(): boolean {
    const { downloadedAudiofiles } = this.props;

    if (!this.audiofileToUse) {
      return false;
    }

    const downloadedAudiofileIds = downloadedAudiofiles.map(audiofile => audiofile.id)

    const isDownloaded = downloadedAudiofileIds.includes(this.audiofileToUse.id);

    return isDownloaded;
  }

  alertIfDifferentSelectedVoice = (): void => {
    const { playlistItem, playerCurrentArticleId, userIsEligibleForTrial } = this.props;

    const audiofileWithUsersSelectedVoice = this.getAudiofileByUserSelectedVoice();
    const selectedVoiceId = audiofileWithUsersSelectedVoice && audiofileWithUsersSelectedVoice.voice.id;
    const audiofileVoiceId = this.audiofileToUse && this.audiofileToUse.voice.id;
    const audiofileVoiceLabel = this.audiofileToUse && this.audiofileToUse.voice.label;
    const isAudioWithSameVoice = selectedVoiceId === audiofileVoiceId;
    const isArticlePlaying = playerCurrentArticleId === playlistItem.article.id;

    // Show an alert, only when the selected article is not playing yet
    if (!isAudioWithSameVoice && !isArticlePlaying) {
      Alert.alert(
        'Article has different voice',
        `Because you are on a free account, we will use the already available audio with the voice "${audiofileVoiceLabel}" for this article.\n\nYou can upgrade to always use your chosen voice.`,
        [
          {
            text: (userIsEligibleForTrial) ? 'Start free trial' : 'Upgrade',
            style: 'cancel',
            onPress: async () => {
              NavigationService.navigate('Upgrade')
              await analytics().logEvent('article_alert_press_upgrade', {
                userIsEligibleForTrial
              })
            }
          },
          {
            text: 'OK'
          }
        ]
      );
    }
  }

  downloadAudiofile = async (url: string, audiofileId: string, filename: string): Promise<string | void> => {
    const { playlistItem } = this.props;

    return new Promise((resolve, reject) => {
      return this.setState({ isActive: true, isLoading: true, isDownloadingAudiofile: true }, async () => {
        try {
          await analytics().logEvent('article_download_audiofile', {
            id: playlistItem.article.id,
            title: playlistItem.article.title ? playlistItem.article.title : '',
            url: playlistItem.article.url,
            audiofileId,
            audiofileUrl: url
          });

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

  handleSetTrack = async (): Promise<any> => {
    const { isConnected } = this.context;
    const { playlistItem } = this.props;

    if (!playlistItem.article || !playlistItem.article.audiofiles.length) {
      return this.setState({ isActive: false, isLoading: false });
    }

    const audiofile = this.audiofileToUse ? this.audiofileToUse : null;

    if (!audiofile) {
      return Alert.alert(ALERT_TITLE_ERROR, 'Something went wrong. We could not play the audio for this article. Please contact our support.');
    }

    const isDownloaded = this.getIsDownloaded();

    if (!isDownloaded && !isConnected) {
      return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
    }

    this.setState({ isActive: true, isLoading: true })

    try {
      this.props.resetPlaybackStatus();

      const artist = playlistItem.article.authorName ? playlistItem.article.authorName : playlistItem.article.sourceName || '';
      const album = playlistItem.article.sourceName ? playlistItem.article.sourceName : '';
      const artwork = playlistItem.article.imageUrl || require('../assets/images/logo-1024.png');
      const localAudiofilePath = cache.getLocalFilePath(audiofile.filename, LOCAL_CACHE_AUDIOFILES_PATH);

      // If the audiofile is downloaded, use the local file path
      // Else, just stream it, and download it after we have loaded the file into the player
      // Resulting in faster plays
      const audiofileUrl = (isDownloaded && localAudiofilePath) ? localAudiofilePath : audiofile.url;

      this.props.setTrack(
        {
          artist,
          album,
          id: audiofile.id,
          title: playlistItem.article.title || '',
          url: audiofileUrl,
          duration: audiofile.length,
          artwork,
          // contentType
          contentType: 'audio/mpeg',
          key: audiofile.id,
          pitchAlgorithm: TrackPlayer.PitchAlgorithm.Voice
        },
        playlistItem.article.id
      );

      // Download the audiofile after we have added it to the player, resulting in faster plays
      if (!isDownloaded) {
        const downloadedLocalAudiofilePath = await this.downloadAudiofile(audiofile.url, audiofile.id, audiofile.filename);

        if (!downloadedLocalAudiofilePath) {
          return this.setState({ isLoading: false }, () => {
            Alert.alert(ALERT_TITLE_ERROR, ALERT_ARTICLE_DOWNLOAD_FAIL);
          });
        }

        // Save the audiofile in store, so we can track which article has downloaded articles
        return this.props.setDownloadedAudiofile(audiofile);
      }

      // IF we end up here, something above failed
      // this.setState({ isActive: false, isLoading: false }, () => Alert.alert(ALERT_TITLE_ERROR, ALERT_ARTICLE_PLAY_FAIL))
    } catch (err) {
      this.setState({ isActive: false, isLoading: false });
      return Alert.alert(ALERT_TITLE_ERROR, ALERT_ARTICLE_PLAY_DOWNLOAD_FAIL);
    }
  }

  fetchPlaylist = async (): Promise<void> => {
    try {
      // await analytics().logEvent('article_playlist_fetch');

      await this.props.onGetPlaylist();
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
    const { playlistItem } = this.props;

    try {
      await analytics().logEvent('article_remove_from_playlist', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

      this.props.deleteArticleFromPlaylist(playlistItem.article.id);
    } catch (err) {
      //
    }
  }

  handleArchiveArticle = async (): Promise<void> => {
    const { playlistItem } = this.props;

    try {
      await analytics().logEvent('article_archive', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

      this.props.archivePlaylistItem(playlistItem.article.id);
    } catch (err) {
      //
    }
  }

  handleFavoriteArticle = async (): Promise<void> => {
    const { playlistItem } = this.props;

    try {
      await analytics().logEvent('article_favorite', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

      this.props.favoritePlaylistItem(playlistItem.article.id);
    } catch (err) {
      //
    }
  }

  handleUnFavoriteArticle = async (): Promise<void> => {
    const { playlistItem } = this.props;

    try {
      await analytics().logEvent('article_unfavorite', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

      this.props.unFavoritePlaylistItem(playlistItem.article.id);
    } catch (err) {
      //
    }
  }

  handleUnArchiveArticle = async (): Promise<void> => {
    const { playlistItem } = this.props;

    try {
      await analytics().logEvent('article_unarchive', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

      this.props.unArchivePlaylistItem(playlistItem.article.id);
    } catch (err) {
      //
    }
  }

  handleOnOpenUrl = () => {
    requestAnimationFrame(async () => {
      const { playlistItem } = this.props;

      await analytics().logEvent('article_press_full', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

      NavigationService.navigate('FullArticle', { article: playlistItem.article })
    });
  }

  handleOnPressUpdate = (): void => {
    requestAnimationFrame(async () => {
      const { playlistItem } = this.props;

      await analytics().logEvent('article_press_update', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

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
    requestAnimationFrame(async () => {
      const { playlistItem } = this.props;

      await analytics().logEvent('article_press_incompatible', {
        id: playlistItem.article.id,
        title: playlistItem.article.title ? playlistItem.article.title : '',
        url: playlistItem.article.url
      });

      return NavigationService.navigate('ContentView');
    });
  }

  render(): JSX.Element {
    const { isCreatingAudiofile, isDownloadingAudiofile, isLoading, isPlaying, isActive } = this.state;
    const { isFavorited, isArchived, isMoving, onLongPress, onPressOut, playlistItem } = this.props;

    // Use the canonicalUrl if we have it, else fall back to the normal url
    const articleUrl = playlistItem.article.canonicalUrl ? playlistItem.article.canonicalUrl : playlistItem.article.url;
    const textDirection = (playlistItem.article.language && playlistItem.article.language.rightToLeft) ? 'rtl' : 'ltr';

    const hasAudiofile = !!this.audiofileToUse;
    const isDownloaded = this.getIsDownloaded();
    const voiceLabel = (this.voiceToUse && this.voiceToUse.label)  ? this.voiceToUse.label : '';

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
        {playlistItem.article.status === 'failed' && <ArticleEmptyFailed isLoading={false} url={articleUrl} />}

        {playlistItem.article.status === 'crawling' && <ArticleEmptyProcessing isLoading={isLoading} onPressUpdate={this.handleOnPressUpdate} url={articleUrl} />}

        {playlistItem.article.status === 'new' && <ArticleEmptyNew isLoading={isLoading} onPressUpdate={this.handleOnPressUpdate} url={articleUrl} />}

        {playlistItem.article.status === 'finished' && (
          <Article
            isMoving={isMoving}
            isLoading={isLoading || isCreatingAudiofile || isDownloadingAudiofile}
            isPlaying={isPlaying}
            isActive={isActive}
            isDownloaded={isDownloaded}
            isFavorited={isFavorited}
            isArchived={isArchived}
            hasAudiofile={hasAudiofile}
            voiceLabel={voiceLabel}
            title={playlistItem.article.title}
            url={articleUrl}
            imageUrl={playlistItem.article.imageUrl}
            playlistItemCreatedAt={playlistItem.createdAt}
            description={playlistItem.article.description}
            sourceName={playlistItem.article.sourceName}
            authorName={playlistItem.article.authorName}
            listenTimeInSeconds={this.listenTimeInSeconds}
            readingTime={playlistItem.article.readingTime}
            textDirection={textDirection}
            onPlayPress={this.handleOnPlayPress}
            onOpenUrl={this.handleOnOpenUrl}
            onLongPress={onLongPress}
            onPressOut={onPressOut}
            onPressArticleIncompatible={this.handleOnPressArticleIncompatible}
            isCompatible={playlistItem.article.isCompatible}
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
  readonly deleteArticleFromPlaylist: typeof deleteArticleFromPlaylist;
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
}

const mapStateToProps = (state: RootState, props: Props) => {
  // Makes the selector memoized accross multiple components
  // More info: https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances
  const selectSelectedVoiceForLanguageName = makeSelectedVoiceForLanguageName();
  const languageName = props.playlistItem.article.language ? props.playlistItem.article.language.name : '';

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
  createAudiofile,
  deleteArticleFromPlaylist,
  archivePlaylistItem,
  favoritePlaylistItem,
  unArchivePlaylistItem,
  unFavoritePlaylistItem,
  resetPlaybackStatus,
  setDownloadedAudiofile,
  setIsCreatingAudiofile,
  resetIsCreatingAudiofile,
  setIsDownloadingAudiofile,
  resetIsDownloadingAudiofile
};

export const ArticleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleContainerComponent);
