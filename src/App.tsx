import * as React from 'react';
import { Platform, NativeModules, AppState, AppStateStatus } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';

import { store } from './store';
import { reactNativeElementsTheme } from './theme';

import { AppNavigator } from './navigation/AppNavigator';
import { ErrorBoundary } from './components/ErrorBoundary';

/* eslint-disable no-undef */
if (Platform.OS === 'ios' && __DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

/* eslint-disable no-console */
console.disableYellowBox = true;

interface State {
  appState: AppStateStatus;
}

export default class App extends React.PureComponent<State> {
  state = {
    appState: AppState.currentState
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // if (Platform.OS === 'android') {
    //   Linking.getInitialURL().then(url => {
    //     this.navigate(url);
    //   });
    // } else {
    //   Linking.addEventListener('url', this.handleOpenURL);
    // }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    // Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground! We should check for new playlist items.');
    }
    this.setState({ appState: nextAppState });
  };

  // handleOpenURL = (event) => {
  //   this.navigate(event.url);
  // }

  // navigate = (url: string) => {
  //   // TODO: make navigation work, app should be wrapped in react navigation
  //   const { navigate } = this.props.navigation;
  //   const route = url.replace(/.*?:\/\//g, '');
  //   navigate(route);
  // }

  render() {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider theme={reactNativeElementsTheme}>
            <AppNavigator />
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    );
  }
}
