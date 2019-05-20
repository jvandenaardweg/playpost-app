import React from 'react';
import { Platform, NativeModules, AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Analytics from 'appcenter-analytics';
// import Crashes from 'appcenter-crashes';
import { PersistGate } from 'redux-persist/integration/react';
// import { CenterLoadingIndicator } from './components/CenterLoadingIndicator';

import { store, persistor } from './store';
import { reactNativeElementsTheme } from './theme';

import { getPlaylist } from './reducers/playlist';

import { AppNavigator } from './navigation/AppNavigator';
// import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkProvider } from './contexts/NetworkProvider';
import { getLanguages } from './reducers/voices';
import { getUser } from './reducers/user';

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

    // TODO: only when logged in
    this.fetchLanguages();
    this.fetchUser();
    // this.setCrashes();

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

  // setCrashes = async () => {
  //   if (!__DEV__) {
  //     await Crashes.setEnabled(true);
  //   }
  // }

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // Only fetch the playlist when there's an active internet connection
      const isConnected = await NetInfo.isConnected.fetch();

      // TODO: only when logged in
      if (isConnected) {
        this.fetchPlaylist();
        this.fetchLanguages();
        this.fetchUser();
      }
    }

    this.setState({ appState: nextAppState });
  }

  async fetchPlaylist() {
    store.dispatch(getPlaylist());
  }

  async fetchLanguages() {
    store.dispatch(getLanguages());
  }

  async fetchUser() {
    store.dispatch(getUser());
  }

  render() {
    return (
      // <ErrorBoundary>
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <NetworkProvider>
              <AppNavigator />
            </NetworkProvider>
          </ThemeProvider>
        </PersistGate>
        </Provider>
      // </ErrorBoundary>
    );
  }
}
