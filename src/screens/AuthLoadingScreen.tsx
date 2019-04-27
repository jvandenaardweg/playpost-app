import React from 'react';
import RNFS from 'react-native-fs';
import * as Keychain from 'react-native-keychain';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import NetInfo from '@react-native-community/netinfo';

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

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(token ? 'App' : 'Onboarding');
  }

  // Render any loading content that you like here
  render() {
    return null;
  }
}
