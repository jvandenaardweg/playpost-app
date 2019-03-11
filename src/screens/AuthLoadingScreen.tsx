import React from 'react';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import * as Keychain from 'react-native-keychain';

import { CenterLoadingIndicator } from '../components/CenterLoadingIndicator';

import { AuthState } from '../reducers/auth';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class AuthLoadingScreenContainer extends React.PureComponent<Props> {
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

const mapStateToProps = (state: { auth: AuthState }) => ({
  auth: state.auth
});

const mapDispatchToProps = {};

export const AuthLoadingScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreenContainer);
