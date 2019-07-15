import axios from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import * as Keychain from 'react-native-keychain';

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

// Android emulator uses 10.0.2.2 as localhost map
export const baseURL = Platform.select({
  ios: Config.API_URL,
  android: (Config.NODE_ENV === 'development') ? Config.API_URL.replace('localhost', '10.0.2.2') : Config.API_URL
});

const apiClient = axios.create({
  baseURL,
  responseType: 'json',
  timeout: 30000 // 30 seconds timeout, creation of audiofiles could take 10 seconds
});

// Set the AUTH token for any request
apiClient.interceptors.request.use(async (config) => {
  const credentials = await Keychain.getGenericPassword(keychainArguments);

  if (credentials) {
    const token = credentials.password;
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
  }
  return config;
});

export { apiClient };
