import axios from 'axios';
import reduxAxiosMiddleware from 'redux-axios-middleware';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import * as Keychain from 'react-native-keychain';

import reducers from '../reducers';

import { API_URL } from '../constants/api';

const client = axios.create({
  baseURL: API_URL,
  responseType: 'json',
  timeout: 30000 // 30 seconds timeout, creation of audiofiles could take 10 seconds
});

// Set the AUTH token for any request
client.interceptors.request.use(async (config) => {
  const credentials = await Keychain.getGenericPassword({ accessGroup: 'group.readto', service: 'com.aardwegmedia.readtoapp' });

  if (credentials) {
    const token = credentials.password;
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
  }
  return config;
});

export const store = createStore(
  combineReducers({
    ...reducers,
  }),
  composeWithDevTools(
    applyMiddleware(
      reduxAxiosMiddleware(client, { returnRejectedPromiseOnError: true })
    )
  )
);
