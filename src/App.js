import React, { Component } from 'react'
import { StyleSheet, View, NativeModules } from 'react-native'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider, connect } from 'react-redux'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'

import AppNavigator from './navigation/AppNavigator'
import rootReducer from './reducers'

if (__DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true)
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const client = axios.create({
  baseURL: 'https://medium-audio.herokuapp.com',
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

type Props = {}

export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
})


