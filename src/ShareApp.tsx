import React from 'react';
import { Platform, NativeModules } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';

import { store } from './store';
import { reactNativeElementsTheme } from './theme';

import { ShareOverlay } from './components/ShareOverlay';
import { NetworkProvider } from './contexts/NetworkProvider';

console.disableYellowBox = true;

export default () => {
  setRemoteDebugging(__DEV__);

  return (
    <Provider store={store}>
      <ThemeProvider theme={reactNativeElementsTheme}>
        <NetworkProvider>
          <ShareOverlay />
        </NetworkProvider>
      </ThemeProvider>
    </Provider>
  );

  function setRemoteDebugging(dev: boolean) {
    if (Platform.OS !== 'ios') return;

    if (!dev) return;

    NativeModules.DevSettings.setIsDebuggingRemotely(true);
  }
};
