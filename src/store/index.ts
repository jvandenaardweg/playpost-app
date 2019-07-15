import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, createStore } from 'redux';
import reduxAxiosMiddleware from 'redux-axios-middleware';
// tslint:disable-next-line:no-submodule-imports
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from '../reducers';
import { initSagas } from '../sagas';

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
