
import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

export const EmptyState = ({ title, description }) => (
  <View style={styles.container}>
    <View style={styles.centered}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
);
