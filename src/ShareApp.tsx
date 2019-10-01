import analytics from '@react-native-firebase/analytics';
import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
// tslint:disable-next-line:no-submodule-imports
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './store';
import { reactNativeElementsTheme } from './theme';

import { isPerfHttpMetricsEnabled } from './api';
import { ShareOverlay } from './components/ShareOverlay';
import { NetworkProvider } from './contexts/NetworkProvider';

// tslint:disable-next-line: no-console
console.disableYellowBox = true;

// Important: Keep this App a Class component
// Using a Functional Component as the root component breaks Hot Reloading (on a local device)
export default class ShareApp extends React.PureComponent {
  async componentDidMount() {
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

    await analytics().setCurrentScreen('Share')
  }

  render (): JSX.Element {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <NetworkProvider>
              <ShareOverlay />
            </NetworkProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}
