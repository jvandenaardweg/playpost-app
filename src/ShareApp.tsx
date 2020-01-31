import analytics from '@react-native-firebase/analytics';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
// tslint:disable-next-line:no-submodule-imports
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './store';
import { reactNativeElementsTheme } from './theme';

import { isPerfHttpMetricsEnabled } from './api';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShareOverlay } from './components/ShareOverlay';
import { NetworkProvider } from './contexts/NetworkProvider';
import { UserThemeProvider } from './contexts/UserThemeProvider';

// tslint:disable-next-line: no-console
console.disableYellowBox = true;

const ShareApp: React.FC = React.memo(() => {
  useEffect(() => {
    const mount = async () => {
      // Disable Firebase services in dev mode
      if (__DEV__) {
        // tslint:disable: no-console

        if (!isPerfHttpMetricsEnabled()) {
          console.log('Notice: Disabled Firebase Performance for local development.')
        }

        await analytics().setAnalyticsCollectionEnabled(false)
        console.log('Notice: Disabled Firebase Analytics for local development.')
      } else {
        await analytics().setAnalyticsCollectionEnabled(true)
      }
    }

    mount()
  }, [])

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <UserThemeProvider>
            <ThemeProvider theme={reactNativeElementsTheme}>
              <NetworkProvider>
                <ShareOverlay />
              </NetworkProvider>
            </ThemeProvider>
          </UserThemeProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );

});

export default ShareApp;
