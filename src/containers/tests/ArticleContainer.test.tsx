import React from 'react';
import { Alert } from 'react-native';
import * as TrackPlayer from 'react-native-track-player';
import renderer from 'react-test-renderer';

import * as cache from '../../cache';

import { ArticleContainerComponent, Props } from '../ArticleContainer';

import articleMock from '../../../tests/__mocks__/article';
import articleMockWithAudioDefaultVoice from '../../../tests/__mocks__/article-with-audio-default-voice';
import playlistItemMock from '../../../tests/__mocks__/playlist-item';
import voiceLanguageDefaultEN from '../../../tests/__mocks__/voice-language-default-en';
import voicePremium from '../../../tests/__mocks__/voice-premium';

import { ALERT_ARTICLE_DOWNLOAD_FAIL, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED, ALERT_TITLE_ERROR, ALERT_TITLE_ERROR_NO_INTERNET } from '../../constants/messages';
import { initialTrackState } from '../../reducers/player';

jest.mock('../../navigation/NavigationService');

const onLongPressHandler = jest.fn();
const onPressOutHandler = jest.fn();
const setTrackHandler = jest.fn();
const getPlaylistHandler = jest.fn();
const createAudiofileHandler = jest.fn();
const deleteArticleFromPlaylistHandler = jest.fn();
const archivePlaylistItemHandler = jest.fn();
const favoritePlaylistItemHandler = jest.fn();
const unArchivePlaylistItemHandler = jest.fn();
const unFavoritePlaylistItemHandler = jest.fn();
const resetPlaybackStatusHandler = jest.fn();
const setDownloadedAudiofileHandler = jest.fn();
const setIsCreatingAudiofileHandler = jest.fn();
const resetIsCreatingAudiofileHandler = jest.fn();
const setIsDownloadingAudiofileHandler = jest.fn();
const resetIsDownloadingAudiofileHandler = jest.fn();
const getUserHandler = jest.fn();

const navigateHandler = jest.fn();
const navigationGetParamHandler = jest.fn();
const navigationGoBackHandler = jest.fn();

const defaultProps: Props = {
  playlistItem: playlistItemMock,
  isFavorited: false,
  isArchived: false,
  isMoving: false,
  onLongPress: onLongPressHandler,
  onPressOut: onPressOutHandler,
  track: initialTrackState,
  isSubscribed: false,
  downloadedAudiofiles: [],
  playerCurrentArticleId: '',
  playerPreviousArticleId: '',
  userIsEligibleForTrial: false,
  playbackState: TrackPlayer.State.None,
  selectedVoiceForLanguageName: undefined,
  setTrack: setTrackHandler,
  onGetPlaylist: getPlaylistHandler,
  createAudiofile: createAudiofileHandler,
  deleteArticleFromPlaylist: deleteArticleFromPlaylistHandler,
  archivePlaylistItem: archivePlaylistItemHandler,
  favoritePlaylistItem: favoritePlaylistItemHandler,
  unArchivePlaylistItem: unArchivePlaylistItemHandler,
  unFavoritePlaylistItem: unFavoritePlaylistItemHandler,
  resetPlaybackStatus: resetPlaybackStatusHandler,
  setDownloadedAudiofile: setDownloadedAudiofileHandler,
  setIsCreatingAudiofile: setIsCreatingAudiofileHandler,
  resetIsCreatingAudiofile: resetIsCreatingAudiofileHandler,
  setIsDownloadingAudiofile: setIsDownloadingAudiofileHandler,
  resetIsDownloadingAudiofile: resetIsDownloadingAudiofileHandler,
  onGetUser: getUserHandler,

  navigation: {
    navigate: navigateHandler,
    getParam: navigationGetParamHandler,
    goBack: navigationGoBackHandler,
  } as any,
};

describe('ArticleContainer', () => {

  describe('rendering', () => {
    let wrapper: renderer.ReactTestRenderer;

    beforeEach(() => {

      const props: Props = {
        ...defaultProps
      }

      wrapper = renderer.create(<ArticleContainerComponent {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: renderer.ReactTestRenderer;

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      const props: Props = {
        ...defaultProps
      }

      wrapper = renderer.create(<ArticleContainerComponent {...props} />);

      // Simulate we have an active internet connection
      wrapper.root.instance.context.isConnected = true;
    });

    it('handleCreateAudiofile() should correctly handle the creation of an audiofile for an article', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spySetIsCreatingAudiofile = jest.spyOn(testInstance.props, 'setIsCreatingAudiofile')
      const spyResetIsCreatingAudiofile = jest.spyOn(testInstance.props, 'resetIsCreatingAudiofile')
      const spyCreateAudiofile = jest.spyOn(testInstance.props, 'createAudiofile')

      // @ts-ignore
      const spyGetPlaylist = jest.spyOn(testInstance.props, 'onGetPlaylist').mockResolvedValueOnce()
      // @ts-ignore
      const spyGetUser = jest.spyOn(testInstance.props, 'onGetUser').mockResolvedValueOnce()

      const spyHandleSetTrack = jest.spyOn(testInstance, 'handleSetTrack')

      await testInstance.handleCreateAudiofile();

      expect(spySetIsCreatingAudiofile).toHaveBeenCalledTimes(1);
      expect(spyCreateAudiofile).toHaveBeenCalledTimes(1);
      expect(spyCreateAudiofile).toHaveBeenCalledWith(articleMock.id);
      expect(spyGetPlaylist).toHaveBeenCalledTimes(1);
      expect(spyGetUser).toHaveBeenCalledTimes(1);
      expect(spyHandleSetTrack).toHaveBeenCalledTimes(1);
      expect(spyResetIsCreatingAudiofile).toHaveBeenCalledTimes(1);

    });

    it('handleCreateAudiofile() should correctly handle an error during audiofile creation', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spySetIsCreatingAudiofile = jest.spyOn(testInstance.props, 'setIsCreatingAudiofile')
      const spyResetIsCreatingAudiofile = jest.spyOn(testInstance.props, 'resetIsCreatingAudiofile')

      // @ts-ignore
      const spyCreateAudiofile = jest.spyOn(testInstance.props, 'createAudiofile').mockRejectedValueOnce(new Error('Some error!'));

      // @ts-ignore
      const spyGetPlaylist = jest.spyOn(testInstance.props, 'onGetPlaylist').mockResolvedValueOnce()
      // @ts-ignore
      const spyGetUser = jest.spyOn(testInstance.props, 'onGetUser').mockResolvedValueOnce()

      const spyHandleSetTrack = jest.spyOn(testInstance, 'handleSetTrack')

      await testInstance.handleCreateAudiofile();

      expect(spySetIsCreatingAudiofile).toHaveBeenCalledTimes(1);
      expect(spyCreateAudiofile).toHaveBeenCalledTimes(1);
      expect(spyCreateAudiofile).toHaveBeenCalledWith(articleMock.id);
      expect(spyGetPlaylist).toHaveBeenCalledTimes(0);
      expect(spyGetUser).toHaveBeenCalledTimes(0);
      expect(spyHandleSetTrack).toHaveBeenCalledTimes(0);
      expect(spyResetIsCreatingAudiofile).toHaveBeenCalledTimes(1);

    });

    it('handleSetTrack() should correctly set a track in the player when the audio is not downloaded yet', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const expectedLocalAudiofilePath = playlistItemMock.article.audiofiles[0].url;
      // const expectedLocalAudiofilePath = `some/local/path/${articleMock.audiofiles[0].filename}`;

      const spyDownloadAudiofile = jest.spyOn(testInstance, 'downloadAudiofile').mockResolvedValueOnce(expectedLocalAudiofilePath)
      const spyResetPlaybackStatus = jest.spyOn(testInstance.props, 'resetPlaybackStatus')
      const spySetDownloadedAudiofile = jest.spyOn(testInstance.props, 'setDownloadedAudiofile');
      const spyGetIsDownloaded = jest.spyOn(testInstance, 'getIsDownloaded');
      const spySetTrack = jest.spyOn(testInstance.props, 'setTrack')

      await testInstance.handleSetTrack();

      expect(spyResetPlaybackStatus).toHaveBeenCalledTimes(1);
      expect(spySetTrack).toHaveBeenCalledTimes(1);
      expect(spySetTrack).toHaveBeenCalledWith(
        {
          album: playlistItemMock.article.sourceName,
          artist: playlistItemMock.article.authorName,
          artwork: playlistItemMock.article.imageUrl,
          contentType: 'audio/mpeg',
          duration: playlistItemMock.article.audiofiles[0].length,
          id: playlistItemMock.article.audiofiles[0].id,
          key: playlistItemMock.article.audiofiles[0].id,
          pitchAlgorithm: TrackPlayer.PitchAlgorithm.Voice,
          title: playlistItemMock.article.title,
          url: expectedLocalAudiofilePath
        },
        '7ca86b8a-02aa-4733-92e4-1cfe7ef46954'
      );

      expect(spyDownloadAudiofile).toHaveBeenCalledTimes(1);

      expect(spyGetIsDownloaded).toHaveReturnedWith(false);

      expect(spySetDownloadedAudiofile).toHaveBeenCalledTimes(1);
      expect(spySetDownloadedAudiofile).toHaveBeenCalledWith(playlistItemMock.article.audiofiles[0]);

      expect(testInstance.state.isActive).toBe(true);
      expect(testInstance.state.isLoading).toBe(true);
    });

    it('handleSetTrack() should correctly set a track in the player when the audio is already downloaded', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      // const expectedLocalAudiofilePath = articleMock.audiofiles[0].url;
      const expectedLocalAudiofilePath = `file://local/test/path/audiofiles/${articleMock.audiofiles[0].id}.mp3`;

      const spyDownloadAudiofile = jest.spyOn(testInstance, 'downloadAudiofile').mockResolvedValueOnce(expectedLocalAudiofilePath)
      const spyResetPlaybackStatus = jest.spyOn(testInstance.props, 'resetPlaybackStatus')
      const spySetDownloadedAudiofile = jest.spyOn(testInstance.props, 'setDownloadedAudiofile');
      const spySetTrack = jest.spyOn(testInstance.props, 'setTrack')
      const spyGetIsDownloaded = jest.spyOn(testInstance, 'getIsDownloaded').mockReturnValue(true)

      await testInstance.handleSetTrack();

      expect(spyResetPlaybackStatus).toHaveBeenCalledTimes(1);
      expect(spySetTrack).toHaveBeenCalledTimes(1);
      expect(spySetTrack).toHaveBeenCalledWith(
        {
          album: articleMock.sourceName,
          artist: articleMock.authorName,
          artwork: articleMock.imageUrl,
          contentType: 'audio/mpeg',
          duration: articleMock.audiofiles[0].length,
          id: articleMock.audiofiles[0].id,
          key: articleMock.audiofiles[0].id,
          pitchAlgorithm: TrackPlayer.PitchAlgorithm.Voice,
          title: articleMock.title,
          url: expectedLocalAudiofilePath
        },
        '7ca86b8a-02aa-4733-92e4-1cfe7ef46954'
      );

      expect(spyGetIsDownloaded).toHaveBeenCalledTimes(2);

      expect(spyDownloadAudiofile).toHaveBeenCalledTimes(0);
      expect(spySetDownloadedAudiofile).toHaveBeenCalledTimes(0);

      expect(testInstance.state.isActive).toBe(true);
      expect(testInstance.state.isLoading).toBe(true);
    });

    it('handleSetTrack() should show an error when there is no downloaded audiofile and the user is not connected to the internet', async () => {

      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMockWithAudioDefaultVoice
        },
        downloadedAudiofiles: []
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      // Simulate we have do not have an active internet connection
      wrapper.root.instance.context.isConnected = false;

      Alert.alert = jest.fn();

      await testInstance.handleSetTrack();

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
      expect(testInstance.state.isActive).toBe(false);
      expect(testInstance.state.isLoading).toBe(false);
    });

    it('handleSetTrack() should show an error when downloadAudiofile does not return something', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMockWithAudioDefaultVoice
        },
        downloadedAudiofiles: []
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyDownloadAudiofile = jest.spyOn(testInstance, 'downloadAudiofile').mockResolvedValueOnce('')
      const spyResetPlaybackStatus = jest.spyOn(testInstance.props, 'resetPlaybackStatus')
      const spySetDownloadedAudiofile = jest.spyOn(testInstance.props, 'setDownloadedAudiofile');
      const spySetTrack = jest.spyOn(testInstance.props, 'setTrack')
      const spyGetIsDownloaded = jest.spyOn(testInstance, 'getIsDownloaded').mockReturnValue(false)

      Alert.alert = jest.fn();

      await testInstance.handleSetTrack();

      expect(spyResetPlaybackStatus).toHaveBeenCalledTimes(1);
      expect(spySetTrack).toHaveBeenCalledTimes(1);

      expect(spyGetIsDownloaded).toHaveBeenCalledTimes(4);
      expect(spyGetIsDownloaded).toHaveReturnedWith(false);

      expect(spyDownloadAudiofile).toHaveBeenCalledTimes(1);
      expect(spySetDownloadedAudiofile).toHaveBeenCalledTimes(0);

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith(ALERT_TITLE_ERROR, ALERT_ARTICLE_DOWNLOAD_FAIL);

      expect(testInstance.state.isActive).toBe(false);
      expect(testInstance.state.isLoading).toBe(false);

    });

    it('handleSetTrack() should use the audiofile\'s url if getLocalFilePath does not return something', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMockWithAudioDefaultVoice
        },
        downloadedAudiofiles: [articleMockWithAudioDefaultVoice.audiofiles[0]]
      }

      const expectedLocalAudiofilePath = `some/local/path/${articleMockWithAudioDefaultVoice.audiofiles[0].filename}`;

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyDownloadAudiofile = jest.spyOn(testInstance, 'downloadAudiofile').mockResolvedValueOnce(expectedLocalAudiofilePath)
      const spyResetPlaybackStatus = jest.spyOn(testInstance.props, 'resetPlaybackStatus')
      const spySetDownloadedAudiofile = jest.spyOn(testInstance.props, 'setDownloadedAudiofile');
      const spySetTrack = jest.spyOn(testInstance.props, 'setTrack')
      const spyGetLocalFilePath = jest.spyOn(cache, 'getLocalFilePath').mockReturnValue('');

      Alert.alert = jest.fn();

      await testInstance.handleSetTrack();

      expect(spyResetPlaybackStatus).toHaveBeenCalledTimes(1);
      expect(spyDownloadAudiofile).toHaveBeenCalledTimes(0);
      expect(spySetDownloadedAudiofile).toHaveBeenCalledTimes(0);
      expect(spyGetLocalFilePath).toHaveBeenCalledTimes(1);
      expect(spyGetLocalFilePath).toHaveReturnedWith('');
      expect(spySetTrack).toHaveBeenCalledTimes(1);
      expect(spySetTrack).toHaveBeenCalledWith(
        {
          album: articleMockWithAudioDefaultVoice.sourceName,
          artist: articleMockWithAudioDefaultVoice.authorName,
          artwork: articleMockWithAudioDefaultVoice.imageUrl,
          contentType: 'audio/mpeg',
          duration: articleMockWithAudioDefaultVoice.audiofiles[0].length,
          id: articleMockWithAudioDefaultVoice.audiofiles[0].id,
          key: articleMockWithAudioDefaultVoice.audiofiles[0].id,
          pitchAlgorithm: TrackPlayer.PitchAlgorithm.Voice,
          title: articleMockWithAudioDefaultVoice.title,
          url: articleMockWithAudioDefaultVoice.audiofiles[0].url
        },
        articleMockWithAudioDefaultVoice.id
      );

      expect(Alert.alert).toHaveBeenCalledTimes(0);
    });

    // Note: we have temporary disabled "alertIfDifferentSelectedVoice" in the component
    it('handleOnPlayPress() should correctly handle when the audio is already available for the correct voice', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyHandleCreateAudiofile = jest.spyOn(testInstance, 'handleCreateAudiofile')
      const spyAlertIfDifferentSelectedVoice = jest.spyOn(testInstance, 'alertIfDifferentSelectedVoice')
      const spyHandleSetTrack = jest.spyOn(testInstance, 'handleSetTrack')
      const spyResetPlaybackStatus = jest.spyOn(testInstance.props, 'resetPlaybackStatus')

      TrackPlayer.default.play = jest.fn()

      await testInstance.handleOnPlayPress();

      expect(spyHandleCreateAudiofile).toHaveBeenCalledTimes(0);
      expect(spyAlertIfDifferentSelectedVoice).toHaveBeenCalledTimes(0);
      // expect(spyAlertIfDifferentSelectedVoice).toHaveReturned();
      expect(spyHandleSetTrack).toHaveBeenCalledTimes(1);
      expect(TrackPlayer.default.play).toHaveBeenCalledTimes(0);
      expect(spyResetPlaybackStatus).toHaveBeenCalledTimes(1);
    });

    it('handleOnPlayPress() should pause the track when it is playing', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      testInstance.state.isPlaying = true;

      TrackPlayer.default.pause = jest.fn()

      await testInstance.handleOnPlayPress();

      expect(TrackPlayer.default.pause).toHaveBeenCalledTimes(1);

      // Reset state
      testInstance.state.isPlaying = false;
    });

    it('handleOnPlayPress() should show an alert when there is no audio and when there is no internet connection', async () => {
      const articleWithoutAudiofiles = {...articleMock }
      articleWithoutAudiofiles.audiofiles = [];

      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleWithoutAudiofiles
        },
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      // Simulate no active internet
      testInstance.context.isConnected = false;

      Alert.alert = jest.fn()

      await testInstance.handleOnPlayPress();

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED);
    });

    // Note: we have temporary disabled "alertIfDifferentSelectedVoice" in the component
    it('handleOnPlayPress() should call alertIfDifferentSelectedVoice() when the user is not subscribed', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMock
        },
        isSubscribed: false,
        playerCurrentArticleId: articleMock.id
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyAlertIfDifferentSelectedVoice = jest.spyOn(testInstance, 'alertIfDifferentSelectedVoice');

      TrackPlayer.default.play = jest.fn()
      Alert.alert = jest.fn()

      await testInstance.handleOnPlayPress();

      expect(spyAlertIfDifferentSelectedVoice).toHaveBeenCalledTimes(0);
    });

    it('handleOnPlayPress() should just play the track when it is loaded in the player', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMock
        },
        playerCurrentArticleId: articleMock.id
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      TrackPlayer.default.play = jest.fn()

      await testInstance.handleOnPlayPress();

      expect(TrackPlayer.default.play).toHaveBeenCalledTimes(1);
    });

    it('handleOnPlayPress() should call handleCreateAudiofile() when there are no audiofiles for this article', async () => {
      const articleWithoutAudiofiles = {...articleMock }
      articleWithoutAudiofiles.audiofiles = [];

      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleWithoutAudiofiles
        },
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyHandleCreateAudiofile = jest.spyOn(testInstance, 'handleCreateAudiofile')

      await testInstance.handleOnPlayPress();

      expect(spyHandleCreateAudiofile).toHaveBeenCalledTimes(1);
    });

    it('handleOnPlayPress() should call handleCreateAudiofile() when the user is subscribed but there is no audio for the user his selected voice on the article', async () => {
      const props: Props = {
        ...defaultProps,
        isSubscribed: true
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyHandleCreateAudiofile = jest.spyOn(testInstance, 'handleCreateAudiofile')
      const spyGetAudiofileByUserSelectedVoice = jest.spyOn(testInstance, 'getAudiofileByUserSelectedVoice').mockReturnValue(undefined);
      const spyAlertIfDifferentSelectedVoice = jest.spyOn(testInstance, 'alertIfDifferentSelectedVoice')

      await testInstance.handleOnPlayPress();

      expect(spyGetAudiofileByUserSelectedVoice).toHaveBeenCalled();
      expect(spyGetAudiofileByUserSelectedVoice).toHaveReturnedWith(undefined);
      expect(spyHandleCreateAudiofile).toHaveBeenCalledTimes(1);

      expect(spyAlertIfDifferentSelectedVoice).toHaveBeenCalledTimes(0);
    });

    it('downloadAudiofile() should correctly download an audiofile', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;
      const mockedAudiofile = articleMock.audiofiles[0];
      const mockedFilePath = `file://${articleMock.audiofiles[0].filename}`;

      const spySetIsDownloadingAudiofile = jest.spyOn(testInstance.props, 'setIsDownloadingAudiofile')
      const spyResetIsDownloadingAudiofile = jest.spyOn(testInstance.props, 'resetIsDownloadingAudiofile')
      const spyDownloadArticleAudiofile = jest.spyOn(cache, 'downloadArticleAudiofile').mockResolvedValueOnce(mockedFilePath)

      const localFilePath = await testInstance.downloadAudiofile(mockedAudiofile.url, mockedAudiofile.id, mockedAudiofile.filename);

      expect(localFilePath).toBe(mockedFilePath);
      expect(testInstance.state.isActive).toBe(true);
      expect(testInstance.state.isLoading).toBe(true);

      expect(spySetIsDownloadingAudiofile).toHaveBeenCalledTimes(1);
      expect(spyDownloadArticleAudiofile).toHaveBeenCalledTimes(1);

      // In finally
      expect(spyResetIsDownloadingAudiofile).toHaveBeenCalledTimes(1);
      expect(testInstance.state.isDownloadingAudiofile).toBe(false);
    });

    it('downloadAudiofile() should correctly handle an error', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;
      const mockedAudiofile = articleMock.audiofiles[0];

      const spySetIsDownloadingAudiofile = jest.spyOn(testInstance.props, 'setIsDownloadingAudiofile')
      const spyResetIsDownloadingAudiofile = jest.spyOn(testInstance.props, 'resetIsDownloadingAudiofile')
      const spyDownloadArticleAudiofile = jest.spyOn(cache, 'downloadArticleAudiofile').mockRejectedValueOnce(new Error('Some error!'))

      try {
        await testInstance.downloadAudiofile(mockedAudiofile.url, mockedAudiofile.id, mockedAudiofile.filename);
      } catch (err) {
        expect(err.message).toBe('Some error!');
        expect(testInstance.state.isLoading).toBe(false);
        expect(testInstance.state.isDownloadingAudiofile).toBe(false);
      }

      expect(spySetIsDownloadingAudiofile).toHaveBeenCalledTimes(1);
      expect(spyDownloadArticleAudiofile).toHaveBeenCalledTimes(1);

      // In finally
      expect(spyResetIsDownloadingAudiofile).toHaveBeenCalledTimes(1);
      expect(testInstance.state.isDownloadingAudiofile).toBe(false);
    })

    it('getAudiofileByUserSelectedVoice() should return no audiofile for the user when there is no audiofile on the article with the user his selected voice', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMockWithAudioDefaultVoice
        },
        selectedVoiceForLanguageName: voicePremium
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const audiofile = testInstance.getAudiofileByUserSelectedVoice();

      // In our mocks, we have no matching audiofile for the selected voice
      // So we expect the audiofile to be undefined
      expect(audiofile).toBe(undefined)
    })

    it('getAudiofileByUserSelectedVoice() should return the audiofile for the user when there is an audiofile on the article with the user his selected voice', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMockWithAudioDefaultVoice
        },
        selectedVoiceForLanguageName: voiceLanguageDefaultEN
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const audiofile = testInstance.getAudiofileByUserSelectedVoice();

      // In our mocks, we have no matching audiofile for the selected voice
      // So we expect the audiofile to be undefined
      expect(audiofile).toMatchObject(articleMockWithAudioDefaultVoice.audiofiles[0])
    })

    it('getAudiofileByUserSelectedVoice() should return the audiofile for the user when there is an audiofile on the article if the user has no selected voice', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMockWithAudioDefaultVoice
        },
        selectedVoiceForLanguageName: voiceLanguageDefaultEN
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const audiofile = testInstance.getAudiofileByUserSelectedVoice();

      // In our mocks, we have no matching audiofile for the selected voice
      // So we expect the audiofile to be undefined
      expect(audiofile).toMatchObject(articleMockWithAudioDefaultVoice.audiofiles[0])
    })

    it('getIsDownloaded should return true when the article audiofile is found in downloadedAudiofiles', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMockWithAudioDefaultVoice
        },
        downloadedAudiofiles: [articleMockWithAudioDefaultVoice.audiofiles[0]],
        selectedVoiceForLanguageName: voiceLanguageDefaultEN
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      expect(testInstance.getIsDownloaded()).toBe(true);
    })

    it('getIsDownloaded should return false when the article audiofile is not found in downloadedAudiofiles', async () => {
      const props: Props = {
        ...defaultProps,
        playlistItem: {
          ...playlistItemMock,
          article: articleMockWithAudioDefaultVoice
        },
        downloadedAudiofiles: [],
        selectedVoiceForLanguageName: voiceLanguageDefaultEN
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      expect(testInstance.getIsDownloaded()).toBe(false);
    })
  })
});
