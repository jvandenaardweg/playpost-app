import React from 'react';
import { Platform, NativeModules } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Analytics from 'appcenter-analytics';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './store';
import { reactNativeElementsTheme } from './theme';

import { AppNavigator } from './navigation/AppNavigator';
import { NetworkProvider } from './contexts/NetworkProvider';
import { AppStateProvider } from './contexts/AppStateProvider';
import { AppStatus } from './components/AppStatus';


// import { whyDidYouUpdate } from 'why-did-you-update';
// whyDidYouUpdate(React, { exclude: /^YellowBox|Icon|Swipeable/ });

if (Platform.OS === 'ios' && __DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

console.disableYellowBox = true;


export default class App extends React.PureComponent {
  componentDidMount() {
    this.setAnalytics();

    // TODO: only when logged in
    // this.fetchLanguages();
    // this.fetchUser();

    // AppState.addEventListener('change', this.handleAppStateChange);
  }

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this.handleAppStateChange);
  // }

  setAnalytics = async () => {
    if (!__DEV__) {
      // Enable Analytics, so we can track errors
      await Analytics.setEnabled(true);
    }
  }

  // handleAppStateChange = async (nextAppState: AppStateStatus) => {
  //   if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
  //     // Only fetch the playlist when there's an active internet connection
  //     const isConnected = await NetInfo.isConnected.fetch();

  //     // TODO: only when logged in
  //     // if (isConnected) {
  //     //   this.fetchPlaylist();
  //     //   this.fetchLanguages();
  //     //   this.fetchUser();
  //     // }
  //   }

  //   this.setState({ appState: nextAppState });
  // }

  // async fetchPlaylist() {
  //   store.dispatch(getPlaylist());
  // }

  // async fetchLanguages() {
  //   store.dispatch(getLanguages());
  // }

  // async fetchUser() {
  //   store.dispatch(getUser());
  // }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <NetworkProvider>
              <AppStateProvider>
                <AppNavigator />
              </AppStateProvider>
            </NetworkProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}
