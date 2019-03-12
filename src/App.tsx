import React from 'react';
import { Platform, NativeModules, AppState, AppStateStatus, NetInfo } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Analytics from 'appcenter-analytics';
import Crashes from 'appcenter-crashes';

import { store } from './store';
import { reactNativeElementsTheme } from './theme';

import { getPlaylists } from './reducers/playlists';

import { AppNavigator } from './navigation/AppNavigator';
import { ErrorBoundary } from './components/ErrorBoundary';

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

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground! We should check for new playlist items.');

      // Only fetch the playlist when there's an active internet connection
      const isConnected = await NetInfo.isConnected.fetch();

      if (isConnected) {
        this.fetchPlaylist();
      }
    }

    this.setState({ appState: nextAppState });
  }

  async fetchPlaylist() {
    console.log('Fetching the user his playlists...');
    store.dispatch(getPlaylists());
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
