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
import { ErrorAlertContainer } from './containers/ErrorAlertContainer';

// import { whyDidYouUpdate } from 'why-did-you-update';
// whyDidYouUpdate(React, { exclude: /^YellowBox|Icon|Swipeable/ });

console.disableYellowBox = true;

async function setAnalytics(dev: boolean) {
  if (dev) return;

  await Analytics.setEnabled(true);
}

function setRemoteDebugging(dev: boolean) {
  if (Platform.OS !== 'ios') return;

  if (!dev) return;

  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

setAnalytics(__DEV__);
setRemoteDebugging(__DEV__);

// Important: Keep this App a Class component
// Using a Functional Component as the root component breaks Hot Reloading (on a local device)
export default class App extends React.PureComponent {
  render () {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <NetworkProvider>
              <AppStateProvider>
                <ErrorAlertContainer>
                  <AppNavigator />
                </ErrorAlertContainer>
              </AppStateProvider>
            </NetworkProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}
