import * as React from 'react';
import { Platform, NativeModules, AppState, AppStateStatus } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Analytics from 'appcenter-analytics';
import Crashes from 'appcenter-crashes';

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

  async componentWillMount() {
    if (process.env.NODE_ENV === 'production') {
      // Enable Analytics, so we can track errors
      await Analytics.setEnabled(true);
      await Crashes.setEnabled(true);
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground! We should check for new playlist items.');
    }
    this.setState({ appState: nextAppState });
  }

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
