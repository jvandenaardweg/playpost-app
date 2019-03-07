import React from 'react';
import { Platform, NativeModules, Alert, AppState, Linking } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import RNRestart from 'react-native-restart';

import { store } from '@/store';

import AppNavigator from './navigation/AppNavigator';

/* eslint-disable no-undef */
if (Platform.OS === 'ios' && __DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

/* eslint-disable no-console */
console.disableYellowBox = true;

const theme = {
  Button: {
    buttonStyle: {
      height: 55
    },
    titleStyle: {
      fontWeight: '600',
      fontSize: 17
    },
  },
};

export default class App extends React.PureComponent {
  state = {
    appState: AppState.currentState
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground! We should check for new playlist items.');
    }
    this.setState({ appState: nextAppState });
  };

  handleOpenURL = (event) => {
    this.navigate(event.url);
  }

  navigate = (url) => {
    // TODO: make navigation work, app should be wrapped in react navigation
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
    // const id = route.match(/\/([^\/]+)\/?$/)[1];
    // const routeName = route.split('/')[0];

    // if (routeName === 'onboarding') {
    navigate(route);
    // }
  }

  componentDidCatch(error, info) {
    // to prevent this alert blocking your view of a red screen while developing
    if (__DEV__) {
      return;
    }

    // to prevent multiple alerts shown to your users
    if (this.errorShown) {
      return;
    }

    this.errorShown = true;

    Alert.alert(
      null,
      'Oops! Something went wrong. Please restart the app to continue.',
      [
        {
          text: 'Restart app',
          onPress: RNRestart.Restart,
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppNavigator />
        </ThemeProvider>
      </Provider>
    );
  }
}
