import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';

export const CACHE_DIRECTORIES = [LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH];

export const getFileNameFromPath = (path: string) => {
  const pathParts = path.split('/');
  const fileName = pathParts[pathParts.length - 1];
  return fileName;
};

/**
 * Gets the local file path based on the filePath and basePath.
 * A filePath could something like: "articles/ad3a5edb-d3f0-4857-ac8c-0dd920704324/audiofiles/4eb3076b-7621-4e06-a28a-4621daef1ecd.mp3"
 * (with a slash)
 */
export const getLocalFilePath = (filePath: string, basePath: string): string => {
  const fileName = getFileNameFromPath(filePath);
  return `file://${basePath}/${fileName}`;
};

export const downloadVoicePreview = async (url: string): Promise<string> => {
  // Make sure the base path exists
  await RNFS.mkdir(LOCAL_CACHE_VOICE_PREVIEWS_PATH);

  const fileName = getFileNameFromPath(url);

  const localFilePath = `${LOCAL_CACHE_VOICE_PREVIEWS_PATH}/${fileName}`;

  // Download the file and store it at the localFilePath
  const result = await RNFetchBlob.config({ path: localFilePath }).fetch('GET', url);

  // Return the local file path
  return `file://${result.path()}`;
};

export const downloadArticleAudiofile = async (url: string, filePath: string): Promise<string> => {
  // Make sure the base path exists
  await RNFS.mkdir(LOCAL_CACHE_AUDIOFILES_PATH);

  const fileName = getFileNameFromPath(filePath);

  const localFilePath = `${LOCAL_CACHE_AUDIOFILES_PATH}/${fileName}`;

  // Download the file and store it at the localFilePath
  const result = await RNFetchBlob.config({ path: localFilePath }).fetch('GET', url);

  if (!result || !result.path()) {
    throw new Error('Could not download audio. Please try again.');
  }

  // Return the local file path
  return `file://${result.path()}`;
};

/**
 * Create the cache directories our app needs.
 */
export const createAllCacheDirectories = async () => {
  for (const cacheDirectory of CACHE_DIRECTORIES) {
    await RNFS.mkdir(cacheDirectory);
  }

  return;
}

/**
 * Empties all cache directories we have. When the directories are deleted, we create them again.
 *
 * Make sure you delete specific paths, and not the entire document directory.
 */
export const emptyAllCaches = async () => {
  for (const cacheDirectory of CACHE_DIRECTORIES) {
    if (await RNFS.exists(cacheDirectory)){
      await RNFS.unlink(cacheDirectory);
    }
  }

  await createAllCacheDirectories();

  return;
}

/**
 * Calculates the cache size in MB in our cache directories
 */
export const getCacheSizeInMb = async () => {
  let combinedSize = 0;
  const sizes = [];

  // Make sure the directories are there
  await createAllCacheDirectories();

  for (const cacheDirectory of CACHE_DIRECTORIES) {
    const files = await RNFS.readDir(cacheDirectory);
    const size = files.reduce((prev, curr) => {
      /* tslint:disable-next-line no-parameter-reassignment */
      prev = prev + parseFloat(curr.size);
      return prev;
    }, 0);
    sizes.push(size);
  }

  if (sizes.length) {
    combinedSize = sizes.reduce((prev, size) => {
      /* tslint:disable-next-line no-parameter-reassignment */
      prev = prev + size;
      return prev;
    }, 0);
  }

  const sizeInMb = (combinedSize / 1000000).toFixed(2);

  return sizeInMb;
}

export const fileExistsInCache = async (path: string) => {
  const exists = await RNFS.exists(path);
  return exists
}
