import React from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NetworkProvider } from './NetworkProvider';

export const AppStateContext = React.createContext({ appState: AppState.currentState, stateChanged: false });

export const AppStateConsumer = AppStateContext.Consumer;

interface State {
  appState: AppStateStatus;
  stateChanged: boolean;
}

export class AppStateProvider extends React.PureComponent<State> {
  state = {
    appState: AppState.currentState,
    stateChanged: false
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const stateChanged = !!(this.state.appState.match(/inactive|background/) && nextAppState === 'active');

    console.log('app state changed?', stateChanged, nextAppState);

    // Detect a change in AppState
    this.setState({
      stateChanged,
      appState: nextAppState
    });
  }

  render() {
    return (
      <AppStateContext.Provider value={this.state}>
        {this.props.children}
      </AppStateContext.Provider>
    );
  }
}
