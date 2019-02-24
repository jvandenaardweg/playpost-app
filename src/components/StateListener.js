import React from 'react';
import { AppState, Text } from 'react-native';

export class AppStateExample extends React.Component {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    const { appState } = this.state;

    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      // TODO: detect if we got items from the share extension that need population (title, description, authorName, sourceName)
      //
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    const { appState } = this.state;

    return (
      <Text>
        Current state is:
        {appState}
      </Text>
    );
  }
};
