
import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

export const EmptyState = (props) => (
  <View style={styles.container}>
    <View style={styles.centered}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.description}>{props.description}</Text>
    </View>
  </View>
);
