import React from 'react';
import { AsyncStorage, Alert } from 'react-native';
import { connect } from 'react-redux';

import { CenterLoadingIndicator } from '../components/CenterLoadingIndicator';

import { setAuthToken, AuthState } from '../reducers/auth';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

interface Props {
  setAuthToken(usertoken: string): void;
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class AuthLoadingScreenContainer extends React.PureComponent<Props> {
  componentDidMount() {
    Alert.alert('Authloading mount');
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    // Alert.alert(`Getting user token...`);
    // Important: Only rely on this token, so the user can use the app offline
    const userToken = await AsyncStorage.getItem('userToken');

    if (userToken) {
      Alert.alert(`Should set token ${userToken}`);
      // Save the auth token in Redux, so it's available for our whole app to use
      this.props.setAuthToken(userToken);
    } else {
      Alert.alert('Does not have a token');
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Onboarding');
  }

  // Render any loading content that you like here
  render() {
    return <CenterLoadingIndicator />;
  }
}

const mapStateToProps = (state: { auth: AuthState }) => ({
  auth: state.auth
});

const mapDispatchToProps = {
  setAuthToken
};

export const AuthLoadingScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreenContainer);
