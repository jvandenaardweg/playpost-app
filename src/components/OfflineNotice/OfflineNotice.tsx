import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';
import { NetworkContext } from '../../contexts/NetworkProvider';

export class OfflineNotice extends React.PureComponent{
  static contextType = NetworkContext;

  render() {
    const { isConnected } = this.context;

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
