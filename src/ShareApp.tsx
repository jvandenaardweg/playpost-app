import React from 'react';
import { NativeModules, Platform } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';

import { store } from './store';
import { reactNativeElementsTheme } from './theme';

import { ShareOverlay } from './components/ShareOverlay';
import { NetworkProvider } from './contexts/NetworkProvider';

// tslint:disable-next-line: no-console
console.disableYellowBox = true;

function setRemoteDebugging(dev: boolean): void {
  if (Platform.OS !== 'ios') { return; }

  if (!dev) { return; }

  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

setRemoteDebugging(__DEV__);

// Important: Keep this App a Class component
// Using a Functional Component as the root component breaks Hot Reloading (on a local device)
export default class ShareApp extends React.PureComponent {
  public render (): JSX.Element {
    return (
      <Provider store={store}>
        <ThemeProvider theme={reactNativeElementsTheme}>
          <NetworkProvider>
            <ShareOverlay />
          </NetworkProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}
