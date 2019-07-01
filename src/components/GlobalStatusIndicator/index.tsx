import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';

import styles from './styles';

interface Props {
  label?: string;
}

export const GlobalStatusIndicator: React.FC<Props> = React.memo(({ label = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <ActivityIndicator size="small" color="white" />
        <Text style={styles.label} testID="GlobalStatusIndicator-label">
          {label}
        </Text>
      </View>
    </View>
  );
});
