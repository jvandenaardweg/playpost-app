import React from 'react';
import { View } from 'react-native';

import styles from './styles';

interface Props {
  children: any;
}

export const AppBackground: React.FC<Props> = ({ children }) => (
  <View style={styles.container}>
    {children}
  </View>
);
