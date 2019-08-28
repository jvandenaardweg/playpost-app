import React from 'react';
import { Alert } from 'react-native';
import * as TrackPlayer from 'react-native-track-player';
import renderer from 'react-test-renderer';

import * as cache from '../../cache';

import { ArticleContainerComponent } from '../ArticleContainer';

import articleMock from '../../../tests/__mocks__/article';
import articleMockWithAudioDefaultVoice from '../../../tests/__mocks__/article-with-audio-default-voice';
import playlistItemMock from '../../../tests/__mocks__/playlist-item';
import voiceLanguageDefaultEN from '../../../tests/__mocks__/voice-language-default-en';
import voicePremium from '../../../tests/__mocks__/voice-premium';

import { ALERT_ARTICLE_DOWNLOAD_FAIL, ALERT_ARTICLE_PLAY_FAIL, ALERT_ARTICLE_PLAY_INTERNET_REQUIRED, ALERT_TITLE_ERROR, ALERT_TITLE_ERROR_NO_INTERNET } from '../../constants/messages';
import { initialTrackState } from '../../reducers/player';

jest.mock('../../navigation/NavigationService');

const onLongPressHandler = jest.fn();
const onPressOutHandler = jest.fn();
const setTrackHandler = jest.fn();
const getPlaylistHandler = jest.fn();
const createAudiofileHandler = jest.fn();
const removeArticleFromPlaylistHandler = jest.fn();
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

const defaultProps: any = {
  article: articleMock,
  playlistItem: playlistItemMock,
  isFavorited: false,
  isArchived: false,
  isMoving: false,
  onLongPress: onLongPressHandler,
  onPressOut: onPressOutHandler,
  track: initialTrackState,
  playbackState: 'none',
  isSubscribed: false,
  userSelectedVoiceByLanguageName: null,
  downloadedAudiofiles: [],
  playerCurrentArticleId: '',
  playerPreviousArticleId: '',
  availableVoicesByLanguageName: null,
  userHasSubscribedBefore: false,

  setTrack: setTrackHandler,
  getPlaylist: getPlaylistHandler,
  createAudiofile: createAudiofileHandler,
  removeArticleFromPlaylist: removeArticleFromPlaylistHandler,
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
  getUser: getUserHandler,

  navigation: {
    navigate: navigateHandler,
    getParam: navigationGetParamHandler,
    goBack: navigationGoBackHandler,
  },
};

describe('ArticleContainer', () => {

  describe('rendering', () => {
    let wrapper: renderer.ReactTestRenderer;

    beforeEach(() => {

      const props = {
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

      const props = {
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
      const spyGetPlaylist = jest.spyOn(testInstance.props, 'getPlaylist').mockResolvedValueOnce()
      // @ts-ignore
      const spyGetUser = jest.spyOn(testInstance.props, 'getUser').mockResolvedValueOnce()

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
      const spyGetPlaylist = jest.spyOn(testInstance.props, 'getPlaylist').mockResolvedValueOnce()
      // @ts-ignore
      const spyGetUser = jest.spyOn(testInstance.props, 'getUser').mockResolvedValueOnce()

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

    it('handleCreateAudiofile() should correctly show an alert when the user has no subscription but has a selected voice that is different from the default', async () => {
      const props = {
        ...defaultProps,
        isSubscribed: false,
        userHasSubscribedBefore: true,
        userSelectedVoiceByLanguageName: {
          'English': voicePremium
        }
      }

      Alert.alert = jest.fn()

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spySetIsCreatingAudiofile = jest.spyOn(testInstance.props, 'setIsCreatingAudiofile')

      await testInstance.handleCreateAudiofile();

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith('Cannot use selected voice', 'Your selected voice for this English article is a Premium voice, but you have no active Premium subscription. If you want to continue to use this voice you should upgrade again.', expect.anything());

      // All the spy's should not be called
      expect(spySetIsCreatingAudiofile).toHaveBeenCalledTimes(0);

      // State should be as it is not loading anything when done
      expect(testInstance.state.isPlaying).toBe(false);
      expect(testInstance.state.isLoading).toBe(false);
      expect(testInstance.state.isActive).toBe(false);
      expect(testInstance.state.isCreatingAudiofile).toBe(false);

    });

    it('handleSetTrack() should correctly set a track in the player', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const expectedLocalAudiofilePath = `some/local/path/${articleMock.audiofiles[0].filename}`;

      const spyDownloadAudiofile = jest.spyOn(testInstance, 'downloadAudiofile').mockResolvedValueOnce(expectedLocalAudiofilePath)
      const spyResetPlaybackStatus = jest.spyOn(testInstance.props, 'resetPlaybackStatus')
      const spySetDownloadedAudiofile = jest.spyOn(testInstance.props, 'setDownloadedAudiofile');
      const spySetTrack = jest.spyOn(testInstance.props, 'setTrack')

      await testInstance.handleSetTrack();

      expect(spyResetPlaybackStatus).toHaveBeenCalledTimes(1);
      expect(spyDownloadAudiofile).toHaveBeenCalledTimes(1);
      expect(spySetDownloadedAudiofile).toHaveBeenCalledTimes(1);
      expect(spySetDownloadedAudiofile).toHaveBeenCalledWith(articleMock.audiofiles[0]);
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
        '98e0c749-3945-45d4-980b-0e5756339de5'
      );
      expect(testInstance.state.isActive).toBe(true);
      expect(testInstance.state.isLoading).toBe(true);
    });

    it('handleSetTrack() should show an error when there is no downloaded audiofile and the user is not connected to the internet', async () => {

      const props = {
        ...defaultProps,
        article: articleMockWithAudioDefaultVoice,
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
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyDownloadAudiofile = jest.spyOn(testInstance, 'downloadAudiofile').mockResolvedValueOnce('')
      const spyResetPlaybackStatus = jest.spyOn(testInstance.props, 'resetPlaybackStatus')
      const spySetDownloadedAudiofile = jest.spyOn(testInstance.props, 'setDownloadedAudiofile');
      const spySetTrack = jest.spyOn(testInstance.props, 'setTrack')

      Alert.alert = jest.fn();

      await testInstance.handleSetTrack();

      expect(spyResetPlaybackStatus).toHaveBeenCalledTimes(1);
      expect(spyDownloadAudiofile).toHaveBeenCalledTimes(1);
      expect(spySetDownloadedAudiofile).toHaveBeenCalledTimes(1);

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith(ALERT_TITLE_ERROR, ALERT_ARTICLE_DOWNLOAD_FAIL);

      expect(testInstance.state.isActive).toBe(false);
      expect(testInstance.state.isLoading).toBe(false);

      expect(spySetTrack).toHaveBeenCalledTimes(0);
    });

    it('handleSetTrack() should show an error when getLocalFilePath does not return something', async () => {
      const props = {
        ...defaultProps,
        article: articleMockWithAudioDefaultVoice,
        downloadedAudiofiles: [articleMockWithAudioDefaultVoice.audiofiles[0]]
      }

      const expectedLocalAudiofilePath = `some/local/path/${articleMock.audiofiles[0].filename}`;

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

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith(ALERT_TITLE_ERROR, ALERT_ARTICLE_PLAY_FAIL);

      expect(testInstance.state.isActive).toBe(false);
      expect(testInstance.state.isLoading).toBe(false);

      expect(spySetTrack).toHaveBeenCalledTimes(0);
    });

    it('handleOnPlayPress() should correctly handle when the audio is already available for the correct voice', async () => {
      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyHandleCreateAudiofile = jest.spyOn(testInstance, 'handleCreateAudiofile')
      const spyAlertIfDifferentSelectedVoice = jest.spyOn(testInstance, 'alertIfDifferentSelectedVoice')
      const spyHandleSetTrack = jest.spyOn(testInstance, 'handleSetTrack')
      const spyResetPlaybackStatus = jest.spyOn(testInstance.props, 'resetPlaybackStatus')

      TrackPlayer.default.play = jest.fn()

      await testInstance.handleOnPlayPress();

      expect(spyHandleCreateAudiofile).toHaveBeenCalledTimes(0);
      expect(spyAlertIfDifferentSelectedVoice).toHaveBeenCalledTimes(1);
      expect(spyAlertIfDifferentSelectedVoice).toHaveReturned();
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

      const props = {
        ...defaultProps,
        article: articleWithoutAudiofiles
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

    it('handleOnPlayPress() should call alertIfDifferentSelectedVoice() when the user is not subscribed', async () => {
      const props = {
        ...defaultProps,
        article: articleMock,
        isSubscribed: false,
        playerCurrentArticleId: articleMock.id
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyAlertIfDifferentSelectedVoice = jest.spyOn(testInstance, 'alertIfDifferentSelectedVoice');

      TrackPlayer.default.play = jest.fn()
      Alert.alert = jest.fn()

      await testInstance.handleOnPlayPress();

      expect(spyAlertIfDifferentSelectedVoice).toHaveBeenCalledTimes(1);
    });

    it('handleOnPlayPress() should just play the track when it is loaded in the player', async () => {
      const props = {
        ...defaultProps,
        article: articleMock,
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

      const props = {
        ...defaultProps,
        article: articleWithoutAudiofiles
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyHandleCreateAudiofile = jest.spyOn(testInstance, 'handleCreateAudiofile')


      await testInstance.handleOnPlayPress();

      expect(spyHandleCreateAudiofile).toHaveBeenCalledTimes(1);
    });

    it('handleOnPlayPress() should call handleCreateAudiofile() when the user is subscribed but there is no audio for the user his selected voice on the article', async () => {
      const props = {
        ...defaultProps,
        isSubscribed: true
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const spyHandleCreateAudiofile = jest.spyOn(testInstance, 'handleCreateAudiofile')
      const spyGetAudiofileByUserSelectedVoice = jest.spyOn(testInstance, 'getAudiofileByUserSelectedVoice').mockReturnValue(undefined);
      const spyAlertIfDifferentSelectedVoice = jest.spyOn(testInstance, 'alertIfDifferentSelectedVoice')

      await testInstance.handleOnPlayPress();

      expect(spyGetAudiofileByUserSelectedVoice).toHaveBeenCalledTimes(2); // One time in handleOnPlayPress, one time in handleCreateAudiofile
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
      const props = {
        ...defaultProps,
        article: articleMockWithAudioDefaultVoice,
        userSelectedVoiceByLanguageName: {
          'English': voicePremium
        },
        availableVoicesByLanguageName: {
          'English': {
            voices: [voiceLanguageDefaultEN]
          }
        }
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const audiofile = testInstance.getAudiofileByUserSelectedVoice();

      // In our mocks, we have no matching audiofile for the selected voice
      // So we expect the audiofile to be undefined
      expect(audiofile).toBe(undefined)
    })

    it('getAudiofileByUserSelectedVoice() should return the audiofile for the user when there is an audiofile on the article with the user his selected voice', async () => {
      const props = {
        ...defaultProps,
        article: articleMockWithAudioDefaultVoice,
        userSelectedVoiceByLanguageName: {
          'English': voiceLanguageDefaultEN
        },
        availableVoicesByLanguageName: {
          'English': {
            voices: [voiceLanguageDefaultEN]
          }
        }
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const audiofile = testInstance.getAudiofileByUserSelectedVoice();

      // In our mocks, we have no matching audiofile for the selected voice
      // So we expect the audiofile to be undefined
      expect(audiofile).toMatchObject(articleMockWithAudioDefaultVoice.audiofiles[0])
    })

    it('getAudiofileByUserSelectedVoice() should return the audiofile for the user when there is an audiofile on the article if the user has no selected voice', async () => {
      const props = {
        ...defaultProps,
        article: articleMockWithAudioDefaultVoice,
        userSelectedVoiceByLanguageName: null,
        availableVoicesByLanguageName: {
          'English': {
            voices: [voiceLanguageDefaultEN]
          }
        }
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      const audiofile = testInstance.getAudiofileByUserSelectedVoice();

      // In our mocks, we have no matching audiofile for the selected voice
      // So we expect the audiofile to be undefined
      expect(audiofile).toMatchObject(articleMockWithAudioDefaultVoice.audiofiles[0])
    })

    it('isDownloaded should return true when the article audiofile is found in downloadedAudiofiles', async () => {
      const props = {
        ...defaultProps,
        article: articleMockWithAudioDefaultVoice,
        downloadedAudiofiles: [articleMockWithAudioDefaultVoice.audiofiles[0]],
        userSelectedVoiceByLanguageName: null,
        availableVoicesByLanguageName: {
          'English': {
            voices: [voiceLanguageDefaultEN]
          }
        }
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      expect(testInstance.isDownloaded).toBe(true);
    })

    it('isDownloaded should return false when the article audiofile is not found in downloadedAudiofiles', async () => {
      const props = {
        ...defaultProps,
        article: articleMockWithAudioDefaultVoice,
        downloadedAudiofiles: [],
        userSelectedVoiceByLanguageName: null,
        availableVoicesByLanguageName: {
          'English': {
            voices: [voiceLanguageDefaultEN]
          }
        }
      }

      wrapper.update(<ArticleContainerComponent {...props} />);

      const testInstance: ArticleContainerComponent = wrapper.root.instance;

      expect(testInstance.isDownloaded).toBe(false);
    })
  })
});
