import Analytics from 'appcenter-analytics';
import React from 'react';
import { Alert, Linking, NativeModules, Platform } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import { ThemeProvider } from 'react-native-elements';
import { useScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
// tslint:disable-next-line:no-submodule-imports
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './store';
import { reactNativeElementsTheme } from './theme';

import { APIErrorAlertContainer } from './containers/APIErrorAlertContainer';
import { AppStateProvider } from './contexts/AppStateProvider';
import { NetworkProvider } from './contexts/NetworkProvider';
import { AppNavigator } from './navigation/AppNavigator';
import NavigationService from './navigation/NavigationService';

// import { whyDidYouUpdate } from 'why-did-you-update';
// whyDidYouUpdate(React, { exclude: /^YellowBox|Icon|Swipeable/ });

useScreens();

// tslint:disable-next-line:no-console
console.disableYellowBox = true;

async function setAnalytics(dev: boolean): Promise<void> {
  if (dev) { return; }

  await Analytics.setEnabled(true);
}

function setRemoteDebugging(dev: boolean): void {
  if (Platform.OS !== 'ios') { return; }

  if (!dev) { return; }

  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

setAnalytics(__DEV__);
setRemoteDebugging(__DEV__);

interface State {
  errorShown: boolean;
}

// Important: Keep this App a Class component
// Using a Functional Component as the root component breaks Hot Reloading (on a local device)
export default class App extends React.PureComponent<State> {
  public state = {
    errorShown: false
  }

  public async componentDidMount(): Promise<void> {
    Linking.addEventListener('url', this.handleUrl);

    DeepLinking.addScheme('playpost://');
    DeepLinking.addScheme('https://');

    DeepLinking.addRoute('/login/reset-password/:resetPasswordToken', ({ path, resetPasswordToken }: { path: string; resetPasswordToken: string }) => {
      // playpost://update-password/123ABC
      NavigationService.navigate('login/reset-password', { resetPasswordToken });
    });

    DeepLinking.addRoute(
      '/playpost.app/login/reset-password/:resetPasswordToken',
      ({ path, resetPasswordToken }: { path: string; resetPasswordToken: string }) => {
        // playpost://update-password/123ABC
        NavigationService.navigate('login/reset-password', { resetPasswordToken });
      }
    );

    try {
      const url = await Linking.getInitialURL();

      if (url) {
        Linking.openURL(url);
      }
    } catch (err) {
      const errorMessage = (err && err.message) ? err.message : 'An uknown error happened while opening a URL.';
      Alert.alert('Oops!', errorMessage);
    }
  }

  public componentWillUnmount(): void {
    Linking.removeEventListener('url', this.handleUrl);
  }

  public componentDidCatch(error: any, info: any) {
    // Do not show an alert when in develop mode
    // Here we want to have React Native's red screen
    if (__DEV__) {
      return;
    }

    // to prevent multiple alerts shown to your users
    if (this.state.errorShown) {
      return;
    }

    this.setState({ errorShown: true });

    // Always hide the splash screen
    // An error could appear on startup
    // When we do not hide the splashscreen, our Alert won't show
    SplashScreen.hide();

    // Track the error
    Analytics.trackEvent('App catch error', { Error: `${error}`, Info: `${info}` });

    // Show the alert to the user
    Alert.alert(
      'Oops!',
      `An unexpected error has occurred. Please close and restart the app.\n\n${error}`,
      [
        {
          style: 'cancel',
          text: 'OK',
          onPress: () => this.setState({ errorShown: false }),
        },
      ],
      { cancelable: false }
    );
}

  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <NetworkProvider>
              <AppStateProvider>
                <APIErrorAlertContainer>
                  {/* Below a method to have the Navigator available everywhere. Just import NavigationService and use: NavigationService.navigate(routeName)  */}
                  <AppNavigator
                    ref={navigatorRef => {
                      NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                  />
                </APIErrorAlertContainer>
              </AppStateProvider>
            </NetworkProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }

  private handleUrl = ({ url }: { url: string }) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }
}
