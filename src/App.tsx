import React from 'react';
import { Platform, NativeModules, AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Analytics from 'appcenter-analytics';
import Crashes from 'appcenter-crashes';

import { store } from './store';
import { reactNativeElementsTheme } from './theme';

import { getPlaylists } from './reducers/playlists';

import { AppNavigator } from './navigation/AppNavigator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkProvider } from './contexts/NetworkProvider';

// import { whyDidYouUpdate } from 'why-did-you-update';
// whyDidYouUpdate(React, { exclude: /^YellowBox|Icon|Swipeable/ });

if (Platform.OS === 'ios' && __DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

console.disableYellowBox = true;

interface State {
  appState: AppStateStatus;
}

export default class App extends React.PureComponent<State> {
  state = {
    appState: AppState.currentState
  };

  componentDidMount() {
    this.setAnalytics();
    this.setCrashes();

    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  setAnalytics = async () => {
    if (!__DEV__) {
      // Enable Analytics, so we can track errors
      await Analytics.setEnabled(true);
    }
  }

  setCrashes = async () => {
    if (!__DEV__) {
      await Crashes.setEnabled(true);
    }
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
            <NetworkProvider>
              <AppNavigator />
            </NetworkProvider>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    );
  }
}
