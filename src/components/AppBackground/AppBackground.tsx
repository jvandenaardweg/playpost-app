import React, { ReactNode } from 'react';
import { View } from 'react-native';

import styles from './styles';

interface Props {
  children: ReactNode;
}

export const AppBackground: React.FC<Props> = React.memo(({ children }) => (
  <View style={styles.container}>
    {children}
  </View>
));
