import React from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

export const OfflineNotice: React.FC = React.memo(() => (
  <View style={styles.container}>
    <Text style={styles.text}>No internet connection, playing is limited</Text>
  </View>
));
