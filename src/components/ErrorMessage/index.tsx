import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import * as Icon from '../Icon';

import styles from './styles';

interface Props {
  errorMessages: string;
  onPressClose(): void;
}

export const ErrorMessage: React.FC<Props> = React.memo(({
  onPressClose,
  errorMessages,
}) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onPressClose}>
      <View style={styles.content}>
        <Text style={styles.title}>Oh no! An error happened...</Text>
        <Text style={styles.message}>{errorMessages}</Text>
      </View>
      <View style={styles.button}><Icon.Feather name="x-circle" size={24} color="#fff" /></View>
    </TouchableOpacity>
  );
});
