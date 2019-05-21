import reduxAxiosMiddleware from 'redux-axios-middleware';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';

import { initSagas } from '../sagas';
import { rootReducer } from '../reducers';

import { apiClient } from '../api';

// Setup persist
const persistConfig = {
  storage: AsyncStorage,
  key: 'root',
  blacklist: ['player']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Setup Sagas middleware
const sagaMiddleware = createSagaMiddleware();

// Create the store with the middlewares
const store = createStore(
  persistedReducer,
  composeWithDevTools(
    applyMiddleware(
      sagaMiddleware,
      reduxAxiosMiddleware(apiClient, { returnRejectedPromiseOnError: true })
    )
  )
);

// Run the sagas
initSagas(sagaMiddleware);

const persistor = persistStore(store);

export { store, persistor };
