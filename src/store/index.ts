import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, createStore } from 'redux';
import reduxAxiosMiddleware from 'redux-axios-middleware';
// tslint:disable-next-line:no-submodule-imports
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createMigrate, PersistConfig, persistReducer, persistStore } from 'redux-persist';

// tslint:disable-next-line:no-submodule-imports
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from '../reducers';
import { initSagas } from '../sagas';

import { apiClient } from '../api';
import { migrations } from './migrations';

// Setup persist
const persistConfig: PersistConfig<any> = {
  storage: AsyncStorage,
  key: 'root',
  blacklist: ['player'],
  version: 9, // up the version if store structure changes and create a migration for that
  migrate: createMigrate(migrations as any)
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

export { store, persistor, persistConfig };
