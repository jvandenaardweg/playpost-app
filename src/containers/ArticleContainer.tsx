import React from 'react';
import { Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import isEqual from 'react-fast-compare';

import { LOCAL_CACHE_AUDIOFILES_PATH } from '../constants/files';
import { ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL, ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL, ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL, ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED, ALERT_ARTICLE_AUDIOFILE_DOWNLOAD_FAIL, ALERT_ARTICLE_PLAY_FAIL, ALERT_ARTICLE_DOWNLOAD_FAIL, ALERT_PLAYLIST_UPDATE_FAIL, ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL, ALERT_ARTICLE_LANGUAGE_UNSUPPORTED, ALERT_ARTICLE_PLAY_DOWNLOAD_FAIL } from '../constants/messages';

import * as cache from '../cache';

import { NetworkContext } from '../contexts/NetworkProvider';

import { Article } from '../components/Article';
import { SwipeableRow } from '../components/SwipeableRow';
import { ArticleEmptyProcessing, ArticleEmptyFailed, ArticleEmptyNew } from '../components/ArticleEmpty';

import { RootState } from '../reducers';
import { getPlaylist, removeArticleFromPlaylist, archivePlaylistItem, favoritePlaylistItem, unArchivePlaylistItem, unFavoritePlaylistItem } from '../reducers/playlist';
import { setTrack, createAudiofile, resetPlaybackStatus } from '../reducers/player';
import { setDownloadedAudiofile } from '../reducers/audiofiles';

import { selectPlayerTrack, selectPlayerPlaybackState, selectPlayerArticleId } from '../selectors/player';
import { selectIsSubscribed } from '../selectors/subscriptions';
import { selectUserSelectedVoiceByLanguageName } from '../selectors/user';
import { selectIsDownloadedAudiofilesByArticleAudiofiles } from '../selectors/audiofiles';
import { selectLanguagesWithActiveVoices, selectDefaultVoiceByLanguageName } from '../selectors/voices';

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
  onLongPress(): void;
  onPressOut(): void;
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
  state = initialState;

  static contextType = NetworkContext;

  componentDidUpdate(prevProps: Props, prevState: State) {
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
  getAudiofileByUserSelectedVoice(): Api.Audiofile | undefined {
    const { article, userSelectedVoiceByLanguageName, defaultVoiceByLanguageName } = this.props;

    // If the user has no custom selected voice, return the audiofile of the default voice for this language
    if (!userSelectedVoiceByLanguageName && defaultVoiceByLanguageName) {
      const audiofileOfDefaultVoice = article.audiofiles.find(audiofile => audiofile.voice.id === defaultVoiceByLanguageName.id);
      return audiofileOfDefaultVoice;
    }

    // Else, we get the audiofile based on the user's selected voice
    return userSelectedVoiceByLanguageName && article.audiofiles.find(audiofile => audiofile.voice.id === userSelectedVoiceByLanguageName.id);
  }

  get audiofileToUse(): Api.Audiofile | undefined {
    const { isSubscribed, article } = this.props;
    const audiofile = (isSubscribed) ? this.getAudiofileByUserSelectedVoice() : article.audiofiles[0];
    return audiofile;
  }

  /**
   * When a user tabs on the play button we:
   * 1. Play the audiofile if it's present
   * 2. Create an audiofile when there's none present
   * 3. Toggle play/pause
   */
  handleOnPlayPress = async () => {
    const { isPlaying } = this.state;
    const { article, isSubscribed, playerArticleId } = this.props;
    const { isConnected } = this.context;

    // Toggle play/pause
    if (isPlaying) return TrackPlayer.pause();

    // If there are no audiofiles and when there's no internet connection
    // Show the user he needs an active internet connection to listen to articles
    if (!article.audiofiles.length && !isConnected) return Alert.alert('No internet', ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);

    // If we don't have an audiofile yet, we create it first
    // Which voice to use for this user is determined on the API
    if (!article.audiofiles.length) return this.handleCreateAudiofile();

    // When we end up here, it means the article already has an audiofile

    // If he user is subscribed, but it has no audio for it's selected voice, we create an audiofile
    if (isSubscribed && !this.getAudiofileByUserSelectedVoice()) return this.handleCreateAudiofile();

    // If the user is on a free account, check if available audiofile uses different voice. Show alert if it does.
    if (!isSubscribed) this.alertIfDifferentSelectedVoice();

    // Only set a new track when it's a different one
    // handleSetTrack will also handle the download of the audio
    if (playerArticleId !== article.id) return this.handleSetTrack();

    // If we end up here, it means the audio is already in the player, we just play it then
    return TrackPlayer.play();
  }

  handleCreateAudiofile = async () => {
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

    const articleLanguageCode = article.language && article.language.code;
    const isLanguageSupported = !!languagesWithActiveVoices.find(language => language.code === articleLanguageCode);

    if (!articleLanguageCode || !isLanguageSupported) {
      return Alert.alert('Language not supported', `${ALERT_ARTICLE_LANGUAGE_UNSUPPORTED}. This article seems to have the language: ${articleLanguageCode}.`);
    }

    // Create the audiofile using our API...
    return this.setState({ isPlaying: false, isLoading: true, isActive: true, isCreatingAudiofile: true }, async () => {
      try {
        await this.props.createAudiofile(article.id); // Create the audiofile using our API, this could take a little time
        await this.props.getPlaylist(); // Get the playlist, it contains the article with the newly created audiofile
        return this.handleSetTrack(); // Set the track. Upon track change, the track with automatically play.
      } catch (err) {
        return this.setState({ isLoading: false, isActive: false });
      } finally {
        return this.setState({ isCreatingAudiofile: false });
      }
    });
  }

  alertIfDifferentSelectedVoice = () => {
    const { article, userSelectedVoiceByLanguageName, playerArticleId } = this.props;

    const selectedVoiceId = userSelectedVoiceByLanguageName && userSelectedVoiceByLanguageName.id;
    const hasAudioWithSameVoice = !!article.audiofiles.find(audiofile => audiofile.voice.id === selectedVoiceId);

    // TODO: fix bug where alert shows even if the voices are the same
    if (!hasAudioWithSameVoice && playerArticleId !== article.id) {
      Alert.alert(
        'Article has different voice',
        'Because you are on a free account, we will use the already available voice for this article. Which is a different voice. Premium users do not have this limitation.',
        [
          {
            text: 'Upgrade to Premium',
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

  downloadAudiofile = async (url: string, audiofileId: string, filename: string): Promise<string | void> => {
    return new Promise((resolve, reject) => {
      return this.setState({ isActive: true, isLoading: true, isDownloadingAudiofile: true }, async () => {
        try {
          const localFilePath = await cache.downloadArticleAudiofile(url, filename);
          resolve(localFilePath);
        } catch (err) {
          this.setState({ isLoading: false, isDownloadingAudiofile: false });

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

    if (!article || !article.audiofiles.length) {
      this.setState({ isActive: false, isLoading: false });
      return Alert.alert('Oops!', ALERT_ARTICLE_PLAY_FAIL);
    }

    const audiofile = (this.audiofileToUse) ? this.audiofileToUse : null;

    if (!audiofile) return Alert.alert('Err', 'no audio');

    if (!isDownloaded && !isConnected) return Alert.alert('No internet', ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);

    return this.setState({ isActive: true, isLoading: true }, async () => {
      try {
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
    const { article } = this.props;
    // Just get the listen time of the first audiofile, for now
    return (article.audiofiles[0] && article.audiofiles[0].length) ? article.audiofiles[0].length : 0;
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
    const { isCreatingAudiofile, isDownloadingAudiofile, isLoading, isPlaying, isActive } = this.state;
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
}

const mapStateToProps = (state: RootState, props: Props) => ({
  track: selectPlayerTrack(state),
  playbackState: selectPlayerPlaybackState(state),
  isSubscribed: selectIsSubscribed(state),
  userSelectedVoiceByLanguageName: selectUserSelectedVoiceByLanguageName(state, (props.article.language) ? props.article.language.name : ''),
  isDownloaded: selectIsDownloadedAudiofilesByArticleAudiofiles(state, props.article.audiofiles),
  playerArticleId: selectPlayerArticleId(state),
  languagesWithActiveVoices: selectLanguagesWithActiveVoices(state),
  defaultVoiceByLanguageName: selectDefaultVoiceByLanguageName(state, (props.article.language) ? props.article.language.name : '')
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
