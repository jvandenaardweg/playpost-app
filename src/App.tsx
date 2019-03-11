import React from 'react';
import { Platform, NativeModules, AppState, AppStateStatus, AsyncStorage } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Analytics from 'appcenter-analytics';
import Crashes from 'appcenter-crashes';

import { store } from './store';
import { reactNativeElementsTheme } from './theme';

import { getUserPlaylists } from './reducers/user';

import { AppNavigator } from './navigation/AppNavigator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineNotice } from './components/OfflineNotice/OfflineNotice';

/* eslint-disable no-undef */
if (Platform.OS === 'ios' && __DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

/* eslint-disable no-console */
console.disableYellowBox = true;

interface State {
  appState: AppStateStatus;
}

export default class App extends React.PureComponent<State> {
  state = {
    appState: AppState.currentState
  };

  async componentWillMount() {
    if (!__DEV__) {
      // Enable Analytics, so we can track errors
      await Analytics.setEnabled(true);
      await Crashes.setEnabled(true);
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground! We should check for new playlist items.');
      this.fetchPlaylist();
    }
    this.setState({ appState: nextAppState });
  }

  async fetchPlaylist() {
    console.log('Fetching the user his playlist...');
    const userToken = await AsyncStorage.getItem('userToken');

    if (userToken) {
      store.dispatch(getUserPlaylists(userToken));
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <React.Fragment>
              <AppNavigator />
            </React.Fragment>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    );
  }
}
