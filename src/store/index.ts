import axios from 'axios';
import reduxAxiosMiddleware from 'redux-axios-middleware';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
// import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import * as Keychain from 'react-native-keychain';
// import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

import { rootReducer } from '../reducers';

import { API_URL } from '../constants/api';

const persistConfig = {
  storage: AsyncStorage,
  key: 'root',
  blacklist: ['player']
  // stateReconciler: hardSet
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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

const store = createStore(
  persistedReducer,
  composeWithDevTools(
    applyMiddleware(
      reduxAxiosMiddleware(client, { returnRejectedPromiseOnError: true })
    )
  )
);

const persistor = persistStore(store);

export { store, persistor };
