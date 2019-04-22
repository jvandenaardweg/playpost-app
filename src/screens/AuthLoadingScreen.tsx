import React from 'react';

import * as Keychain from 'react-native-keychain';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import NetInfo from '@react-native-community/netinfo';

// import { CenterLoadingIndicator } from '../components/CenterLoadingIndicator';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class AuthLoadingScreen extends React.PureComponent<Props> {
  componentDidMount() {
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    // Important: Only rely on this token, so the user can use the app offline
    const credentials = await Keychain.getGenericPassword({ accessGroup: 'group.postplay', service: 'com.aardwegmedia.postplay' });
    let token = null;

    if (credentials && credentials.password) {
      token = credentials.password;
    }

    await NetInfo.isConnected.fetch();

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(token ? 'App' : 'Onboarding');
  }

  // Render any loading content that you like here
  render() {
    return null;
  }
}
