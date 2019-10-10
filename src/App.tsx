import analytics from '@react-native-firebase/analytics';
import React from 'react';
import { Alert, InteractionManager, Linking } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import { ThemeProvider } from 'react-native-elements';
import { useScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
// tslint:disable-next-line:no-submodule-imports
import { PersistGate } from 'redux-persist/integration/react';

useScreens();

import { persistor, store } from './store';
import { reactNativeElementsTheme } from './theme';

import { NavigationAction, NavigationState } from 'react-navigation';
import { isPerfHttpMetricsEnabled } from './api';
import { ALERT_TITLE_ERROR } from './constants/messages';
import { APIErrorAlertContainer } from './containers/APIErrorAlertContainer';
import { SubscriptionHandlerContainer } from './containers/SubscriptionHandlerContainer';
import { AppStateProvider } from './contexts/AppStateProvider';
import { NetworkProvider } from './contexts/NetworkProvider';
import { AppContainer } from './navigation/AppNavigator';
import NavigationService from './navigation/NavigationService';

interface State {
  errorShown: boolean;
}

// Important: Keep this App a Class component
// Using a Functional Component as the root component breaks Hot Reloading (on a local device)
export default class App extends React.PureComponent<State> {
  state = {
    errorShown: false
  }

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

    InteractionManager.runAfterInteractions(async () => {
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
        Alert.alert(ALERT_TITLE_ERROR, errorMessage);
      }
    })

  }

  componentWillUnmount(): void {
    Linking.removeEventListener('url', this.handleUrl);
  }

  componentDidCatch(error: any, info: any) {
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

    // Show the alert to the user
    Alert.alert(
      ALERT_TITLE_ERROR,
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

  /**
   * Method to get the active route name from react-navigation.
   */
  getActiveRouteName = (
    navigationState: NavigationState
  ): string | null => {
    if (!navigationState) {
      return null;
    }

    const route = navigationState.routes[navigationState.index];

    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }

    return route.routeName;
  }

  /**
   * Sets the correct screen name in our Analytics.
   *
   * From: https://reactnavigation.org/docs/en/screen-tracking.html
   */
  handleOnNavigationStateChange = (
    prevState: NavigationState,
    currentState: NavigationState,
    action: NavigationAction
  ): void => {
    requestAnimationFrame(async () => {
      const currentScreenName = this.getActiveRouteName(currentState);
      const prevScreenName = this.getActiveRouteName(prevState);

      // Only set track on screen change
      if (prevScreenName !== currentScreenName && currentScreenName) {
        await analytics().setCurrentScreen(currentScreenName)
      }
    })
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <NetworkProvider>
              <AppStateProvider>
                <APIErrorAlertContainer>
                  <SubscriptionHandlerContainer>
                    <AppContainer
                      ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                      }}
                      onNavigationStateChange={this.handleOnNavigationStateChange}
                    />
                  </SubscriptionHandlerContainer>
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
