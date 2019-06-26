import React from 'react';
import { Platform, NativeModules, Linking } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Analytics from 'appcenter-analytics';
import { PersistGate } from 'redux-persist/integration/react';
import DeepLinking from 'react-native-deep-linking';

import { store, persistor } from './store';
import { reactNativeElementsTheme } from './theme';

import { AppNavigator } from './navigation/AppNavigator';
import { NetworkProvider } from './contexts/NetworkProvider';
import { AppStateProvider } from './contexts/AppStateProvider';
import { APIErrorAlertContainer } from './containers/APIErrorAlertContainer';
import NavigationService from './navigation/NavigationService';

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
  componentDidMount() {
    Linking.addEventListener('url', this.handleUrl);

    DeepLinking.addScheme('playpost://');
    DeepLinking.addScheme('https://');

    DeepLinking.addRoute('/login/reset-password/:resetPasswordToken', ({ path, resetPasswordToken }: { path: string, resetPasswordToken: string }) => {
      // playpost://update-password/123ABC
      console.log('Should navigate to: ', path, ' with resetPasswordToken: ', resetPasswordToken);
      NavigationService.navigate('login/reset-password', { resetPasswordToken });
    });

    DeepLinking.addRoute('/playpost.app/login/reset-password/:resetPasswordToken', ({ path, resetPasswordToken }: { path: string, resetPasswordToken: string }) => {
      // playpost://update-password/123ABC
      console.log('http Should navigate to: ', path, ' with resetPasswordToken: ', resetPasswordToken);
      NavigationService.navigate('login/reset-password', { resetPasswordToken });
    });

    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred on linking', err));

  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleUrl);
  }

  handleUrl = ({ url }: { url: string }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }

  render () {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <NetworkProvider>
              <AppStateProvider>
                <APIErrorAlertContainer>
                  {/* Below a method to have the Navigator available everywhere. Just import NavigationService and use: NavigationService.navigate(routeName)  */}
                  <AppNavigator ref={(navigatorRef) => { NavigationService.setTopLevelNavigator(navigatorRef); }} />
                </APIErrorAlertContainer>
              </AppStateProvider>
            </NetworkProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}
