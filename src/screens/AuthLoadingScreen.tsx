import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import * as Keychain from 'react-native-keychain';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { CenterLoadingIndicator } from '../components/CenterLoadingIndicator';

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
    const credentials = await Keychain.getGenericPassword({ accessGroup: 'group.readto', service: 'com.aardwegmedia.readtoapp' });
    let token = null;

    if (credentials) {
      token = credentials.password;
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(token ? 'App' : 'Onboarding');
    SplashScreen.hide();
  }

  // Render any loading content that you like here
  render() {
    return <CenterLoadingIndicator />;
  }
}
