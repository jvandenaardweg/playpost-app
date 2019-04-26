import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

import { LOCAL_CACHE_VOICE_PREVIEWS_PATH, LOCAL_CACHE_AUDIOFILES_PATH } from '../constants/files';

export const getFileNameFromPath = (path: string) => {
  const pathParts = path.split('/');
  const fileName = pathParts[pathParts.length - 1];
  return fileName;
};

/**
 * Gets the local file path based on the fileName and basePath.
 * A fileName could something like: "ad3a5edb-d3f0-4857-ac8c-0dd920704324/4eb3076b-7621-4e06-a28a-4621daef1ecd.mp3"
 * (with a slash)
 */
export const getLocalFilePath = (fileName: string, basePath: string) => {
  return `file://${basePath}/${fileName}`;
};

export const downloadVoicePreview = async (url: string) => {
  // Make sure the base path exists
  await RNFS.mkdir(LOCAL_CACHE_VOICE_PREVIEWS_PATH);

  const fileName = getFileNameFromPath(url);

  const localFilePath = `${LOCAL_CACHE_VOICE_PREVIEWS_PATH}/${fileName}`;

  // Download the file and store it at the localFilePath
  await RNFetchBlob.config({ path: localFilePath }).fetch('GET', url);

  // Return the local file path
  return `file://${localFilePath}`;
};

export const downloadArticleAudiofile = async (url: string, filePath: string) => {
  // Make sure the base path exists
  await RNFS.mkdir(LOCAL_CACHE_AUDIOFILES_PATH);

  const fileName = getFileNameFromPath(filePath);

  const localFilePath = `${LOCAL_CACHE_AUDIOFILES_PATH}/${fileName}`;

  // Download the file and store it at the localFilePath
  await RNFetchBlob.config({ path: localFilePath }).fetch('GET', url);

  // Return the local file path
  return `file://${localFilePath}`;
};
