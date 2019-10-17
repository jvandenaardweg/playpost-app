import analytics from '@react-native-firebase/analytics';
import isUUID from 'is-uuid';
import React from 'react';
import { Alert, Linking, Platform, UIManager } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import { ThemeProvider as ReactNativeElementsThemeProvider } from 'react-native-elements';
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
import { addArticleToPlaylistById } from './reducers/playlist';
import { selectIsLoggedIn } from './selectors/auth';
import { UserThemeContext, UserThemeProvider } from './contexts/UserThemeProvider';

// https://facebook.github.io/react-native/docs/layoutanimation
// Note that in order to get this to work on Android you need to set the following flags via UIManager:
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface State {
  errorShown: boolean;
}

// Important: Keep this App a Class component
// Using a Functional Component as the root component breaks Hot Reloading (on a local device)
export default class App extends React.PureComponent<State> {
  static contextType = UserThemeContext;

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

    // Handle deeplinking only on app start
    try {
      const url = await Linking.getInitialURL();
      if (url) {
        await this.handleUrl({ url });
        // await Linking.openURL(url); // Do not use openURL, but handle using the DeepLinking package
      }
    } catch (err) {
      const errorMessage = (err && err.message) ? err.message : 'An uknown error happened while opening a URL.';
      Alert.alert(ALERT_TITLE_ERROR, errorMessage);
    }

    // Handles deeplink when app is in memory
    Linking.addEventListener('url', this.handleUrl);

    DeepLinking.addScheme('playpost://');
    DeepLinking.addScheme('https://');

    DeepLinking.addRoute('/playlist/add/:articleId/:otherParams', ({ path, articleId, otherParams }: { path: string; articleId: string, otherParams: string }) => {
      this.handleArticleAddDeeplink(articleId, otherParams);
    });
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

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <UserThemeProvider>
            <ReactNativeElementsThemeProvider theme={reactNativeElementsTheme}>
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
            </ReactNativeElementsThemeProvider>
          </UserThemeProvider>
        </PersistGate>
      </Provider>
    );
  }

  /**
   * Method to get the active route name from react-navigation.
   */
  private getActiveRouteName = (
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
  private handleOnNavigationStateChange = (
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

  private handleUrl = async ({ url }: { url: string }): Promise<any> => {
    const isSupported = await Linking.canOpenURL(url)
    if (isSupported) {
      return DeepLinking.evaluateUrl(url);
    }
  }

  private handleArticleAddDeeplink = (articleId: string, otherParams: string) => {
    const isLoggedIn = selectIsLoggedIn(store.getState())

    if (!isLoggedIn) {
      return Alert.alert(
        'Oops!',
        `You need to be logged in to add this article to your playlist. Try again after logging in.`,
        [
          {
            text: 'Ok',
            style: 'cancel'
          }
        ],
        { cancelable: false }
      );
    }

    // Important: We should not trust any data we get in here, as any website can use our scheme to directly target screens in our app

    // Check if received articleId is a valid UUID
    if (!articleId || !isUUID.anyNonNil(articleId)) {
      return Alert.alert(
        'Add new article',
        `The article you want to add to your playlist does not seem to be valid.`,
        [
          {
            text: 'Ok',
            style: 'cancel'
          }
        ],
        { cancelable: false }
      );
    }

    // Get the title out of the query parameter, trim it and limit it to max 100 characters to prevent abuse
    const titleParam = otherParams ? unescape(otherParams.replace('?title=', '').trim()) : null;
    const articleTitle = titleParam ? titleParam.substring(0, 100) : null;

    // Important: do not navigate, as this triggers 2 alerts
    // NavigationService.navigate('Playlist', { articleId });

    return Alert.alert(
      'Add new article',
      `Are you sure you want to add this article to your playlist?\n\n${articleTitle}`,
      [
        {
          text: 'Add article',
          onPress: () => store.dispatch(addArticleToPlaylistById(articleId))
        },
        {
          text: 'Cancel',
          style: 'cancel',
        }
      ],
      { cancelable: false }
    );
  }
}
