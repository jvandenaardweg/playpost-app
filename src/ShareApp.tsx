import React from 'react';
import { Platform, NativeModules, AppState, AppStateStatus } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';

import { store } from './store';
import { reactNativeElementsTheme } from './theme';

import { ErrorBoundary } from './components/ErrorBoundary';
import { ShareOverlay } from './components/ShareOverlay';
import { NetworkProvider } from './contexts/NetworkProvider';

if (Platform.OS === 'ios' && __DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

console.disableYellowBox = true;

interface State {
  appState: AppStateStatus;
}

export default class ShareApp extends React.PureComponent<State> {
  state = {
    appState: AppState.currentState
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
    }
    this.setState({ appState: nextAppState });
  }

  render() {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <NetworkProvider>
              <ShareOverlay />
            </NetworkProvider>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    );
  }
}
