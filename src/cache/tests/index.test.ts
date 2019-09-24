import * as RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob';

import * as cache from '../index';

import articleMock from '../../../tests/__mocks__/article-with-audio-default-voice';
import voiceMock from '../../../tests/__mocks__/voice-en-gb';

describe('cache', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('getLocalFilePath()', () => {
    it('should return the local file path', () => {
      const filepath = cache.getLocalFilePath('a/path/to/something.mp3', 'base');
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


      const filepath = await cache.downloadVoicePreview(exampleUrl)

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

      const filepath = await cache.downloadArticleAudiofile(exampleUrl, audiofileFilename)

      expect(filepath).toBe(`file://${expectedLocalFilePath}`)
      expect(spyMkdir).toHaveBeenCalledTimes(1)
      expect(spyMkdir).toHaveBeenCalledWith('local/test/path/audiofiles')
      expect(spyFetch).toHaveBeenCalledTimes(1)
      expect(spyFetch).toHaveBeenCalledWith({
        path: expectedLocalFilePath
      })

    })
  })

  describe('createAllCacheDirectories()', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should create all needed cache directories', async () => {
      const spyMkdir = jest.spyOn(RNFS, 'mkdir').mockResolvedValue()

      const totalCacheDirectories = cache.CACHE_DIRECTORIES.length

      await cache.createAllCacheDirectories()

      expect(spyMkdir).toHaveBeenCalledTimes(totalCacheDirectories)

      for (const cacheDirectory of cache.CACHE_DIRECTORIES) {
        expect(spyMkdir).toHaveBeenCalledWith(cacheDirectory)
      }
    })
  })

  describe('emptyAllCaches()', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should empty all the available cache directories', async () => {
      const spyExists = jest.spyOn(RNFS, 'exists').mockResolvedValue(true)
      const spyUnlink = jest.spyOn(RNFS, 'unlink').mockResolvedValue()
      const spyCreateAllCacheDirectories = jest.spyOn(cache, 'createAllCacheDirectories').mockResolvedValue()

      const totalCacheDirectories = cache.CACHE_DIRECTORIES.length

      await cache.emptyAllCaches()

      expect(spyExists).toHaveBeenCalledTimes(totalCacheDirectories)
      expect(spyUnlink).toHaveBeenCalledTimes(totalCacheDirectories)
      expect(spyCreateAllCacheDirectories).toHaveBeenCalledTimes(1)

      for (const cacheDirectory of cache.CACHE_DIRECTORIES) {
        expect(spyExists).toHaveBeenCalledWith(cacheDirectory)
        expect(spyUnlink).toHaveBeenCalledWith(cacheDirectory)
      }
    })
  })

  describe('getCacheSizeInMb()', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should return the total cache size in MB', async () => {
      const mockReadDirResult: RNFS.ReadDirItem[] = cache.CACHE_DIRECTORIES.map(cacheDirectory => {
        return {
          ctime: new Date(),
          mtime: new Date(),
          name: 'mock',
          path: cacheDirectory,
          size: '12345678',
          isFile: () => false,
          isDirectory: () => true
        }
      })

      const spyReadDir = jest.spyOn(RNFS, 'readDir').mockResolvedValue(mockReadDirResult)
      const spyCreateAllCacheDirectories = jest.spyOn(cache, 'createAllCacheDirectories').mockResolvedValue()

      const cacheSizeInMb = await cache.getCacheSizeInMb()

      expect(spyReadDir).toHaveBeenCalledTimes(2)
      expect(spyCreateAllCacheDirectories).toHaveBeenCalledTimes(1)
      expect(cacheSizeInMb).toBe('49.38')

      for (const cacheDirectory of cache.CACHE_DIRECTORIES) {
        expect(spyReadDir).toHaveBeenCalledWith(cacheDirectory)
      }

    })
  })
});
