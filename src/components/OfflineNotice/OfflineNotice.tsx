import React from 'react';
import { View, Text, NetInfo } from 'react-native';

import styles from './styles';

interface State {
  isConnected?: boolean;
}

export class OfflineNotice extends React.PureComponent<State> {
  state = {
    isConnected: true
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected: boolean) => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  }

  render() {
    const { isConnected } = this.state;

    if (!isConnected) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>No internet connection, playing is limited</Text>
        </View>
      );
    }
    return null;
  }
}
