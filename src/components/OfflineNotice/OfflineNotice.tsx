import React from 'react';
import { View, Text, NetInfo } from 'react-native';

import styles from './styles';

export class OfflineNotice extends React.PureComponent {
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
    console.log('change', isConnected);
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  }

  render() {
    const { isConnected } = this.state;

    if (!isConnected) {
      console.log('render message')
      return (
        <View style={styles.container}>
          <Text style={styles.text}>No Internet Connection</Text>
        </View>
      );
    }
    return null;
  }
}
