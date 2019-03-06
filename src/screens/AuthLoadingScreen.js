import React from 'react';
import Analytics from 'appcenter-analytics';
import {
  ActivityIndicator,
  AsyncStorage,
  View,
} from 'react-native';

export class AuthLoadingScreen extends React.Component {
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

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Onboarding');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator />
        {/* <StatusBar barStyle="default" /> */}
      </View>
    );
  }
};
