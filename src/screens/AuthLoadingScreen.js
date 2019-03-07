import React from 'react';
import Analytics from 'appcenter-analytics';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';

import { CenterLoadingIndicator } from '@/components/CenterLoadingIndicator';

import { setAuthToken } from '@/reducers/auth';

export class AuthLoadingScreenContainer extends React.Component {
  componentDidMount() {
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    if (process.env.NODE_ENV === 'production') {
      // Enable Analytics, so we can track errors
      await Analytics.setEnabled(true);
    }

    // Important: Only rely on this token, so the user can use the app offline
    const userToken = await AsyncStorage.getItem('userToken');

    // Save the auth token in Redux, so it's available for our whole app to use
    this.props.setAuthToken(userToken);

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Onboarding');
  };

  // Render any loading content that you like here
  render() {
    return <CenterLoadingIndicator />;
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = {
  setAuthToken
};

export const AuthLoadingScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreenContainer);
