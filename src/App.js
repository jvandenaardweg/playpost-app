import React from 'react';
import {
  Platform, StyleSheet, View, NativeModules
} from 'react-native';
import {
  createStore, combineReducers, applyMiddleware, compose
} from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import AppNavigator from './navigation/AppNavigator';
import rootReducer from './reducers';

/* eslint-disable no-undef */
if (Platform.OS === 'ios' && __DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const client = axios.create({
  baseURL: 'http://readto-api.herokuapp.com',
  responseType: 'json'
});

const store = createStore(
  combineReducers({
    ...rootReducer,
  }),
  composeEnhancers(
    applyMiddleware(
      axiosMiddleware(client)
    )
  )
);

export default App = () => (
  <Provider store={store}>
    <View style={styles.container}>
      <AppNavigator />
    </View>
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


// export default from '../storybook';
