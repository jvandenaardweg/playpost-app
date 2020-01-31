import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';

import { persistor, store } from '../store';

import SplashScreen from 'react-native-splash-screen';
import * as cache from '../cache';
import colors from '../constants/colors';
import { setAuthToken } from '../reducers/auth';
import * as keychain from '../utils/keychain';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export const AuthLoadingScreen: React.FC<Props> = React.memo((props) => {
  const bootstrapAsync = async () => {
    // Determine if this is the first run after install
    // If so, delete any API token we had from a previous install
    // This will make sure the user starts clean and will see the onboarding screen, instead of the app screen
    const hasRunBefore = await AsyncStorage.getItem('@hasRunBefore');

    if (!hasRunBefore) {
      // Delete any API token we had from a previous install
      await keychain.resetToken()

      // Reset the persisted store, so we start clean from previous installs
      await persistor.purge();

      // Set the item to something, so we don't reset the API token upon next launch
      await AsyncStorage.setItem('@hasRunBefore', 'true');
    }

    // Check if the user already has an API token
    // Important: Only rely on this token, so the user can use the app offline
    const token = await keychain.getToken();

    if (token) {
      // Store the token in Redux, so we can determine if a user is logged in or not
      store.dispatch(setAuthToken(token));
    }

    // Get the network connection status
    // So we know if we can do API requests, or not
    await NetInfo.fetch();

    // Make sure we have the correct cache direct\ories needed in the app
    await cache.createAllCacheDirectories();

    if (!token) {
      return props.navigation.navigate('Onboarding');
    }

    // User is logged in if we end up here

    // Prepare the app for the logged in user

    props.navigation.navigate('App');

    return SplashScreen.hide()
  }

  useEffect(() => {
    bootstrapAsync();

    StatusBar.setBarStyle('dark-content');

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.white)
    }
  }, [])

  return null;
})
