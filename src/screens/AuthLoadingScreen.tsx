import React from 'react';
import RNFS from 'react-native-fs';
import * as Keychain from 'react-native-keychain';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class AuthLoadingScreen extends React.PureComponent<Props> {
  componentDidMount() {
    this.bootstrapAsync();
  }

  // Upon load of the app, do the following...
  bootstrapAsync = async () => {

    // Determine if this is the first run after install
    // If so, delete any API token we had from a previous install
    // This will make sure the user starts clean and will see the onboarding screen, instead of the app screen
    const hasRunBefore = await AsyncStorage.getItem('@hasRunBefore');

    if (!hasRunBefore) {
      // Delete any API token we had from a previous install
      await Keychain.resetGenericPassword();

      // Set the item to something, so we don't reset the API token upon next launch
      await AsyncStorage.setItem('@hasRunBefore', 'true');
    }

    // Check if the user already has an API token
    // Important: Only rely on this token, so the user can use the app offline
    const credentials = await Keychain.getGenericPassword({ accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' });
    let token = null;

    if (credentials && credentials.password) {
      token = credentials.password;
    }

    // Get the network connection status
    // So we know if we can do API requests, or not
    await NetInfo.isConnected.fetch();

    // Make sure we have the correct cache directories needed in the app
    await RNFS.mkdir(LOCAL_CACHE_AUDIOFILES_PATH);
    await RNFS.mkdir(LOCAL_CACHE_VOICE_PREVIEWS_PATH);

    if (!token) {
      return this.props.navigation.navigate('Onboarding');
    }

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
