import React from 'react';
import { Platform, NativeModules, Alert } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import RNRestart from 'react-native-restart';

import AppNavigator from './navigation/AppNavigator';
import rootReducer from './reducers';

/* eslint-disable no-undef */
if (Platform.OS === 'ios' && __DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

/* eslint-disable no-console */
console.disableYellowBox = true;

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const client = axios.create({
  baseURL: 'https://readto-api-production.herokuapp.com',
  responseType: 'json'
});

const theme = {
  Button: {
    buttonStyle: {
      height: 55
    },
    titleStyle: {
      fontWeight: '600',
      fontSize: 17
    },
  },
};


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

export default class App extends React.PureComponent {
  componentDidCatch(error, info) {
    // to prevent this alert blocking your view of a red screen while developing
    if (__DEV__) {
      return;
    }

    // to prevent multiple alerts shown to your users
    if (this.errorShown) {
      return;
    }

    this.errorShown = true;

    Alert.alert(
      null,
      'Oops! Something went wrong. Please restart the app to continue.',
      [
        {
          text: 'Restart app',
          onPress: RNRestart.Restart,
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppNavigator />
        </ThemeProvider>
      </Provider>
    );
  }
}
