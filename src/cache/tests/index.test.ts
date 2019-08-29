import * as RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob';
import { downloadArticleAudiofile, downloadVoicePreview, getLocalFilePath } from '../index';

import articleMock from '../../../tests/__mocks__/article-with-audio-default-voice';
import voiceMock from '../../../tests/__mocks__/voice-en-gb';

describe('cache', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('getLocalFilePath()', () => {
    it('should return the local file path', () => {
      const filepath = getLocalFilePath('a/path/to/something.mp3', 'base');
      expect(filepath).toEqual('file://base/something.mp3');
    });
  });

  describe('downloadVoicePreview()', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should return a local file path uri of a downloaded voice preview', async () => {
      const exampleUrl = voiceMock.exampleAudioUrl as string;
      const expectedLocalFilePath = `local/test/path/voices/${voiceMock.id}.mp3`;

      const spyMkdir = jest.spyOn(RNFS, 'mkdir')
      const spyFetch = jest.spyOn(RNFetchBlob, 'config')


      const filepath = await downloadVoicePreview(exampleUrl)

      expect(filepath).toBe(`file://${expectedLocalFilePath}`)
      expect(spyMkdir).toHaveBeenCalledTimes(1)
      expect(spyMkdir).toHaveBeenCalledWith('local/test/path/voices')
      expect(spyFetch).toHaveBeenCalledTimes(1)
      expect(spyFetch).toHaveBeenCalledWith({
        path: expectedLocalFilePath
      })

    })
  })

  describe('downloadArticleAudiofile()', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should return a local file path uri of a downloaded article audiofile', async () => {
      const audiofile = articleMock.audiofiles[0];
      const audiofileFilename = audiofile.filename;
      const exampleUrl = audiofile.url;

      const expectedLocalFilePath = `local/test/path/audiofiles/${articleMock.audiofiles[0].id}.mp3`;

      const spyMkdir = jest.spyOn(RNFS, 'mkdir')
      const spyFetch = jest.spyOn(RNFetchBlob, 'config')

      const filepath = await downloadArticleAudiofile(exampleUrl, audiofileFilename)

      expect(filepath).toBe(`file://${expectedLocalFilePath}`)
      expect(spyMkdir).toHaveBeenCalledTimes(1)
      expect(spyMkdir).toHaveBeenCalledWith('local/test/path/audiofiles')
      expect(spyFetch).toHaveBeenCalledTimes(1)
      expect(spyFetch).toHaveBeenCalledWith({
        path: expectedLocalFilePath
      })

    })
  })
});
