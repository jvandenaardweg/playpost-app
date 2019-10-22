import analytics from '@react-native-firebase/analytics';
import isUUID from 'is-uuid';
import React, { useEffect } from 'react';
import { Alert, Linking, Platform, UIManager } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import { Provider } from 'react-redux';
// tslint:disable-next-line:no-submodule-imports
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './store';

import { isPerfHttpMetricsEnabled } from './api';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ALERT_TITLE_ERROR } from './constants/messages';
import { APIErrorAlertContainer } from './containers/APIErrorAlertContainer';
import { SubscriptionHandlerContainer } from './containers/SubscriptionHandlerContainer';
import { AppStateProvider } from './contexts/AppStateProvider';
import { NetworkProvider } from './contexts/NetworkProvider';
import { UserThemeProvider } from './contexts/UserThemeProvider';
import { AppContainer } from './navigation/AppNavigator';

import { ReactNativeThemeProvider } from './components/ReactNativeThemeProvider';
import { addArticleToPlaylistById } from './reducers/playlist';
import { selectIsLoggedIn } from './selectors/auth';

// https://facebook.github.io/react-native/docs/layoutanimation
// Note that in order to get this to work on Android you need to set the following flags via UIManager:
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App: React.FC = React.memo(() => {
  useEffect(() => {
    const onMount = async () => {
      if (__DEV__) {
        // tslint:disable: no-console

        if (!isPerfHttpMetricsEnabled()) {
          console.log('Notice: Disabled Firebase Performance for local development.');
        }

        await analytics().setAnalyticsCollectionEnabled(false);
        console.log('Notice: Disabled Firebase Analytics for local development.');
      } else {
        await analytics().setAnalyticsCollectionEnabled(true);
      }

      // Handle deeplinking only on app start
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          await handleUrl({ url });
          // await Linking.openURL(url); // Do not use openURL, but handle using the DeepLinking package
        }
      } catch (err) {
        const errorMessage = err && err.message ? err.message : 'An uknown error happened while opening a URL.';
        Alert.alert(ALERT_TITLE_ERROR, errorMessage);
      }

      // Handles deeplink when app is in memory
      Linking.addEventListener('url', handleUrl);

      DeepLinking.addScheme('playpost://');
      DeepLinking.addScheme('https://');

      DeepLinking.addRoute('/playlist/add/:articleId/:otherParams', ({ articleId, otherParams }: { path: string; articleId: string; otherParams: string }) => {
        handleArticleAddDeeplink(articleId, otherParams);
      });
    };

    onMount();

    return () => {
      Linking.removeEventListener('url', handleUrl);
    };
  }, []);




  const handleUrl = async ({ url }: { url: string }): Promise<any> => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      return DeepLinking.evaluateUrl(url);
    }
  };

  const handleArticleAddDeeplink = (articleId: string, otherParams: string) => {
    const isLoggedIn = selectIsLoggedIn(store.getState());

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
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <UserThemeProvider>
            <ReactNativeThemeProvider>
              <NetworkProvider>
                <AppStateProvider>
                  <>
                    <APIErrorAlertContainer />
                    <SubscriptionHandlerContainer />
                    <AppContainer />
                  </>
                </AppStateProvider>
              </NetworkProvider>
            </ReactNativeThemeProvider>
          </UserThemeProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
});

export default App;
