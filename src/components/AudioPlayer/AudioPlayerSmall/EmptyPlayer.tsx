import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

export const EmptyPlayer = () => (
  <View style={styles.container}>
    <Text style={styles.emptyText}>Select an article to listen</Text>
  </View>
);
