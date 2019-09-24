import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';

import { persistor, store } from '../store';

import colors from '../constants/colors';
import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';
import { setAuthToken } from '../reducers/auth';
import * as keychain from '../utils/keychain';
import * as cache from '../cache';


interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class AuthLoadingScreen extends React.PureComponent<Props> {
  componentDidMount() {
    this.bootstrapAsync();

    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor(colors.white)
  }

  // Upon load of the app, do the following...
  bootstrapAsync = async () => {
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
    await NetInfo.isConnected.fetch();

    // Make sure we have the correct cache direct\ories needed in the app
    await cache.createAllCacheDirectories();

    if (!token) {
      return this.props.navigation.navigate('Onboarding');
    }

    // User is logged in if we end up here

    // Prepare the app for the logged in user

    // Pre-populate the app with the user data
    // Every other pre-population is done within the start screen, so we can load faster
    // await store.dispatch(getUser());
    return this.props.navigation.navigate('App');
  }

  // Render any loading content that you like here
  render() {
    return null;
  }
}
