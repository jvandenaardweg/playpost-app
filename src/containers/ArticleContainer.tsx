import React from 'react';
import isEqual from 'react-fast-compare';
import { Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import { LOCAL_CACHE_AUDIOFILES_PATH } from '../constants/files';
import {
  ALERT_ARTICLE_DOWNLOAD_FAIL,
  ALERT_ARTICLE_LANGUAGE_UNSUPPORTED,
  ALERT_ARTICLE_PLAY_DOWNLOAD_FAIL,
  ALERT_ARTICLE_PLAY_FAIL,
  ALERT_ARTICLE_PLAY_INTERNET_REQUIRED,
  ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL,
  ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL,
  ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL,
  ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL,
  ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL,
  ALERT_PLAYLIST_UPDATE_FAIL
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
import { selectIsDownloadedAudiofilesByArticleAudiofiles } from '../selectors/audiofiles';
import { selectPlayerArticleId, selectPlayerPlaybackState, selectPlayerTrack } from '../selectors/player';
import { selectIsSubscribed } from '../selectors/subscriptions';
import { selectUserSelectedVoiceByLanguageName } from '../selectors/user';
import { selectDefaultVoiceByLanguageName, selectLanguagesWithActiveVoices } from '../selectors/voices';

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

type Props = IProps & StateProps & DispatchProps;

export class ArticleContainerComponent extends React.PureComponent<Props, State> {

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

  public static contextType = NetworkContext;
  public state = initialState;

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { playbackState, playerArticleId, article } = this.props;
    const { isLoading, isCreatingAudiofile, isDownloadingAudiofile } = this.state;

    const isActiveInPlayer = playerArticleId === article.id;
    const hasSomethingLoading = isCreatingAudiofile || isDownloadingAudiofile;

    // If the article is not active in the player
    // And if the state is different from the initial state
    // Reset it, because the track became inactive
    if (!isActiveInPlayer && !hasSomethingLoading && !isLoading && !isEqual(this.state, initialState)) {
      return this.setState(initialState);
    }

    if (!hasSomethingLoading) {
      // When a track is playing
      if (playbackState && [TrackPlayer.STATE_PLAYING].includes(playbackState) && !prevState.isPlaying) {
        this.setState({ isPlaying: true, isActive: true, isLoading: false });
      }

      // When a track is stopped or paused
      if (playbackState && [TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_PAUSED].includes(playbackState) && prevState.isPlaying) {
        this.setState({ isPlaying: false, isActive: true });
      }
    }
  }

  /**
   * Find the audiofile in this article using the user's selected voice
   */
  public getAudiofileByUserSelectedVoice(): Api.Audiofile | undefined {
    const { article, userSelectedVoiceByLanguageName, defaultVoiceByLanguageName } = this.props;

    // If the user has no custom selected voice, return the audiofile of the default voice for this language
    if (!userSelectedVoiceByLanguageName && defaultVoiceByLanguageName) {
      const audiofileOfDefaultVoice = article.audiofiles.find(audiofile => audiofile.voice.id === defaultVoiceByLanguageName.id);
      return audiofileOfDefaultVoice;
    }

    // Else, we get the audiofile based on the user's selected voice
    return userSelectedVoiceByLanguageName && article.audiofiles.find(audiofile => audiofile.voice.id === userSelectedVoiceByLanguageName.id);
  }

  /**
   * When a user tabs on the play button we:
   * 1. Play the audiofile if it's present
   * 2. Create an audiofile when there's none present
   * 3. Toggle play/pause
   */
  public handleOnPlayPress = async (): Promise<void> => {
    const { isPlaying } = this.state;
    const { article, isSubscribed, playerArticleId } = this.props;
    const { isConnected } = this.context;

    // Toggle play/pause
    if (isPlaying) { return TrackPlayer.pause(); }

    // If there are no audiofiles and when there's no internet connection
    // Show the user he needs an active internet connection to listen to articles
    if (!article.audiofiles.length && !isConnected) {
      return Alert.alert('No internet', ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
    }

    // If we don't have an audiofile yet, we create it first
    // Which voice to use for this user is determined on the API
    if (!article.audiofiles.length) { return this.handleCreateAudiofile(); }

    // When we end up here, it means the article already has an audiofile

    // If he user is subscribed, but it has no audio for it's selected voice, we create an audiofile
    if (isSubscribed && !this.getAudiofileByUserSelectedVoice()) {
      return this.handleCreateAudiofile();
    }

    // If the user is on a free account, check if available audiofile uses different voice. Show alert if it does.
    if (!isSubscribed) { this.alertIfDifferentSelectedVoice(); }

    // Only set a new track when it's a different one
    // handleSetTrack will also handle the download of the audio
    if (playerArticleId !== article.id) { return this.handleSetTrack(); }

    // If we end up here, it means the audio is already in the player, we just play it then
    return TrackPlayer.play();
  }

  public handleCreateAudiofile = async (): Promise<void> => {
    const { article, languagesWithActiveVoices, userSelectedVoiceByLanguageName, isSubscribed } = this.props;

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
            text: 'Upgrade to Premium or Plus',
            onPress: () => this.props.navigation.navigate('Upgrade')
          },
          {
            text: `Change ${selectedVoiceLanguageName} voice`,
            onPress: () =>
              this.props.navigation.navigate('SettingsVoices', {
                languageName: selectedVoiceLanguageName
              })
          }
        ]
      );
    }

    const articleLanguageCode = article.language && article.language.code;
    const isLanguageSupported = !!languagesWithActiveVoices.find(language => language.code === articleLanguageCode);

    if (!articleLanguageCode || !isLanguageSupported) {
      return Alert.alert('Language not supported', `${ALERT_ARTICLE_LANGUAGE_UNSUPPORTED}. This article seems to have the language: ${articleLanguageCode}.`);
    }

    // Create the audiofile using our API...
    return this.setState(
      {
        isPlaying: false,
        isLoading: true,
        isActive: true,
        isCreatingAudiofile: true
      },
      async () => {
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
          return this.setState({ isLoading: false, isActive: false });
        } finally {
          this.props.resetIsCreatingAudiofile();
          this.setState({ isCreatingAudiofile: false });
        }
      }
    );
  }

  public alertIfDifferentSelectedVoice = (): void => {
    const { article, playerArticleId } = this.props;

    const audiofileWithUsersSelectedVoice = this.getAudiofileByUserSelectedVoice();
    const selectedVoiceId = audiofileWithUsersSelectedVoice && audiofileWithUsersSelectedVoice.voice.id;
    const audiofileVoiceId = this.audiofileToUse && this.audiofileToUse.voice.id;
    const isAudioWithSameVoice = selectedVoiceId === audiofileVoiceId;
    const isArticlePlaying = playerArticleId === article.id;

    // Show an alert, only when the selected article is not playing yet
    if (!isAudioWithSameVoice && !isArticlePlaying) {
      Alert.alert(
        'Article has different voice',
        'Because you are on a free account, we will use the already available voice for this article. Which is a different voice. Premium users do not have this limitation.',
        [
          {
            text: 'Upgrade to Premium or Plus',
            onPress: () => this.props.navigation.navigate('Upgrade')
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
    }
  }

  public downloadAudiofile = async (url: string, audiofileId: string, filename: string): Promise<string | void> => {
    return new Promise((resolve, reject) => {
      return this.setState({ isActive: true, isLoading: true, isDownloadingAudiofile: true }, async () => {
        try {
          this.props.setIsDownloadingAudiofile();
          const localFilePath = await cache.downloadArticleAudiofile(url, filename);
          resolve(localFilePath);
        } catch (err) {
          this.setState({ isLoading: false, isDownloadingAudiofile: false });
        } finally {
          this.props.resetIsDownloadingAudiofile();
          this.setState({ isDownloadingAudiofile: false });
        }
      });
    });
  }

  public handleSetTrack = async (): Promise<void> => {
    const { isConnected } = this.context;
    const { article, isDownloaded } = this.props;

    if (!article || !article.audiofiles.length) {
      this.setState({ isActive: false, isLoading: false });
      return Alert.alert('Oops!', ALERT_ARTICLE_PLAY_FAIL);
    }

    const audiofile = this.audiofileToUse ? this.audiofileToUse : null;

    if (!audiofile) { return Alert.alert('Err', 'no audio'); }

    if (!isDownloaded && !isConnected) {
      return Alert.alert('No internet', ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
    }

    return this.setState({ isActive: true, isLoading: true }, async () => {
      try {
        this.props.resetPlaybackStatus();

        const artist = article.authorName ? article.authorName : article.sourceName || '';
        const album = article.sourceName ? article.sourceName : '';

        let localAudiofilePath = cache.getLocalFilePath(audiofile.filename, LOCAL_CACHE_AUDIOFILES_PATH);

        if (!isDownloaded) {
          const downloadedLocalAudiofilePath = await this.downloadAudiofile(audiofile.url, audiofile.id, audiofile.filename);

          // Save the audiofile in store, so we can track which article has downloaded articles
          this.props.setDownloadedAudiofile(audiofile);

          if (downloadedLocalAudiofilePath) {
            localAudiofilePath = downloadedLocalAudiofilePath;
          } else {
            return this.setState({ isLoading: false }, () => {
              Alert.alert('Oops!', ALERT_ARTICLE_DOWNLOAD_FAIL);
            });
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
            },
            article.id
          );
        }

        // IF we end up here, something above failed
        return Alert.alert('Oops!', ALERT_ARTICLE_PLAY_FAIL);
      } catch (err) {
        this.setState({ isActive: false, isLoading: false });
        return Alert.alert('Oops!', ALERT_ARTICLE_PLAY_DOWNLOAD_FAIL);
      }
    });
  }

  public fetchPlaylist = async (): Promise<void> => {
    try {
      await this.props.getPlaylist();
    } catch (err) {
      Alert.alert('Oops!', ALERT_PLAYLIST_UPDATE_FAIL, [
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

  public handleRemoveArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.removeArticleFromPlaylist(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert('Oops!', ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL, [
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

  public handleArchiveArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.archivePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert('Oops!', ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL, [
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

  public handleFavoriteArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.favoritePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert('Oops!', ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL, [
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

  public handleUnFavoriteArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.unFavoritePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert('Oops!', ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL, [
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

  public handleUnArchiveArticle = async (): Promise<void> => {
    const articleId = this.props.article.id;

    try {
      await this.props.unArchivePlaylistItem(articleId);
      this.fetchPlaylist();
    } catch (err) {
      Alert.alert('Oops!', ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL, [
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

  public handleOnOpenUrl = (url: string) => {
    const { article } = this.props;

    return this.props.navigation.navigate('FullArticle', { article });
  }

  public handleOnPressUpdate = (): void => {
    this.setState({ isLoading: true }, async () => {
      try {
        await this.fetchPlaylist();
      } finally {
        this.setState({ isLoading: false });
      }
    });
  }

  public render() {
    const { isCreatingAudiofile, isDownloadingAudiofile, isLoading, isPlaying, isActive } = this.state;
    const { article, isDownloaded, isFavorited, isArchived, isMoving, onLongPress, onPressOut, playlistItem } = this.props;

    // Use the canonicalUrl if we have it, else fall back to the normal url
    const articleUrl = article.canonicalUrl ? article.canonicalUrl : article.url;

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
        )}
      </SwipeableRow>
    );
  }
}

interface StateProps {
  readonly track: ReturnType<typeof selectPlayerTrack>;
  readonly playbackState: ReturnType<typeof selectPlayerPlaybackState>;
  readonly isSubscribed: ReturnType<typeof selectIsSubscribed>;
  readonly userSelectedVoiceByLanguageName: ReturnType<typeof selectUserSelectedVoiceByLanguageName>;
  readonly isDownloaded: ReturnType<typeof selectIsDownloadedAudiofilesByArticleAudiofiles>;
  readonly playerArticleId: ReturnType<typeof selectPlayerArticleId>;
  readonly languagesWithActiveVoices: ReturnType<typeof selectLanguagesWithActiveVoices>;
  readonly defaultVoiceByLanguageName: ReturnType<typeof selectDefaultVoiceByLanguageName>;
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

const mapStateToProps = (state: RootState, props: Props) => ({
  track: selectPlayerTrack(state),
  playbackState: selectPlayerPlaybackState(state),
  isSubscribed: selectIsSubscribed(state),
  userSelectedVoiceByLanguageName: selectUserSelectedVoiceByLanguageName(state, props.article.language ? props.article.language.name : ''),
  isDownloaded: selectIsDownloadedAudiofilesByArticleAudiofiles(state, props.article.audiofiles),
  playerArticleId: selectPlayerArticleId(state),
  languagesWithActiveVoices: selectLanguagesWithActiveVoices(state),
  defaultVoiceByLanguageName: selectDefaultVoiceByLanguageName(state, props.article.language ? props.article.language.name : '')
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
