import React from 'react';
import { View } from 'react-native';

import { Text } from '../Text';
import styles from './styles';

export const OfflineNotice: React.FC = React.memo(() => (
  <View style={styles.container}>
    <Text style={styles.text} preset="footnoteEmphasized">No internet connection, playing is limited</Text>
  </View>
));
