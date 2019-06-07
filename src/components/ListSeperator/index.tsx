import React from 'react';
import { View } from 'react-native';

import styles from './styles';

export const ListSeperator: React.FC = React.memo(() => (
  <View style={styles.seperator}>
    <View style={styles.seperatorLine}></View>
  </View>
));