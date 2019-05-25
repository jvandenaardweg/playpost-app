import axios from 'axios';
import * as Keychain from 'react-native-keychain';

import { API_URL } from '../constants/api';

const apiClient = axios.create({
  baseURL: API_URL,
  responseType: 'json',
  timeout: 30000 // 30 seconds timeout, creation of audiofiles could take 10 seconds
});

// Set the AUTH token for any request
apiClient.interceptors.request.use(async (config) => {
  const credentials = await Keychain.getGenericPassword({ accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' });

  if (credentials) {
    const token = credentials.password;
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
  }
  return config;
});

export { apiClient };
