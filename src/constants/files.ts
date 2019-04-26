import RNFS from 'react-native-fs';

export const LOCAL_CACHE_BASE_PATH = RNFS.DocumentDirectoryPath;

export const LOCAL_CACHE_AUDIOFILES_PATH = `${LOCAL_CACHE_BASE_PATH}/audiofiles`;
export const LOCAL_CACHE_VOICE_PREVIEWS_PATH = `${LOCAL_CACHE_BASE_PATH}/voice-previews`;
