import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

interface Props {
  title: string
  description: string
}

export const EmptyState = ({ title, description }: Props) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
);
