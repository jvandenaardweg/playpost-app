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

// import { whyDidYouUpdate } from 'why-did-you-update';
// whyDidYouUpdate(React, { exclude: /^YellowBox|Icon|Swipeable/ });

console.disableYellowBox = true;

export default () => {
  setAnalytics(__DEV__);
  setRemoteDebugging(__DEV__);

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

  async function setAnalytics(dev: boolean) {
    if (dev) return;

    await Analytics.setEnabled(true);
  }

  function setRemoteDebugging(dev: boolean) {
    if (Platform.OS !== 'ios') return;

    if (!dev) return;

    NativeModules.DevSettings.setIsDebuggingRemotely(true);
  }
};
