import React from 'react';
import { Platform, NativeModules } from 'react-native';
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

export default class ShareApp extends React.PureComponent {
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
